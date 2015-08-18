var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var session = require('express-session'); //使用session需要使用这个模块
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var flash = require('connect-flash');
var passport = require('passport'),
	LocalStrategy = require('passport-local');
var MongoStore = require('connect-mongo')(session); //把session存到数据库需要使用
var app = express();
var async = require('async');
var User = require('./config/models/user')
var userRoles = require('./app/build/js/routingConfig').userRoles;
//连接数据库
var dbUrl = 'mongodb://127.0.0.1:27017/onlineform';
mongoose.connect(dbUrl);

passport.serializeUser(function(user,done){
  // console.log('开始序列化session');
  done(null, user.name);
});

passport.deserializeUser(function(user,done){
  User.findOne({username: user.username}, function(err,user){
    done(null, user);
  })
});

passport.use(new LocalStrategy(function(username,password,done){
  User.findOne({name: username},function (err,user){
    // console.log(user);
    if(err){
      return done(err);
    }

    if(!user){
      return done(null, false, {message: '未知用户' + username});
    }

    user.comparePassword(password,function(err, isMath){
      if(err) return done(err);
      if(isMath){
        // console.log('密码比对正确，开始序列化session');
        return done(null, user);
      }else{
        return done(null,false,{message: '用户密码验证错误!'})
      }
    })
  })
}))

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '/app')));


app.use(session({
    secret: 'OnlineForm',
    store: new MongoStore({
      url: dbUrl,
      collection: 'sessions',
      auto_reconnect: true
    })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.set('views', './config/views');
app.set('view engine', 'jade');


app.locals.moment = require('moment');
//引入路由
require('./config/route')(app);

app.post('/user/signin',function (req,res,next){
  passport.authenticate('local',function(err,user,info){
    if(err){
      return next(err);
    }

    if(!user){
      console.log(info.message);
      req.flash('error', info.message);
      return res.status(400).json({msg:req.flash('error')[0]});
    }

    req.logIn(user,function(err){
      if(err) {
        return next(err);
      }
      req.session.user = user;
      var role;
      if(user.role == 4){
          role = userRoles.admin;
      }else{
          role = userRoles.user;
      }

      async.series([
        function(cb){
          res.cookie('user', JSON.stringify({
              'username': user.name,
              'role': role
          }))
          // console.log('设置好了cookie!');
          cb(null);
        },
        function(cb){
          res.json(200, {
              "role": user.role,
              "username": user.name
          })
          // console.log('发送好用户数据');
          cb(null);
        } 
        ]);
      // console.log(user);
      // console.log(role);
      // return res.json(user.role);
    })
  })(req,res,next);
})

app.all('/*', function(req, res, next) {
    // Just send the index.html for other files to support HTML5Mode
    res.sendFile('index.html', { root: __dirname+ '/app' });
});

//判断线上环境和开发环境是否一致,打印数据库操作日志
if ("development" === app.get("env")) {
    app.set("showStackError", true);
    app.use(logger(":method :url :status"));
    app.locals.pretty = true;
    mongoose.set("debug", true);
}

//设置监听端口
var port = process.env.PORT || 9000;
app.listen(port);

console.log('onlineform started on port' + port);
