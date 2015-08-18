var User = require('../models/user');
var Lab = require('../models/lab');
var Form = require('../models/form');
var _ = require('underscore');
var async = require('async');


exports.save = function(req, res) {
    var _user;
    var userObj = req.body;
    console.log(userObj);
    if(userObj._id){
        User.findById(userObj._id,function(err,user){
            _user= _.extend(user,userObj);
            _user.save(function(err, user) {
                if (err) console.log(err);
                req.session.user = user;
                res.json({success: 1})
            })
        })
    }else{
        // var userObj = req.body;
        var userName = userObj.name;
        User.findOne({
            name: userObj.name
        }, function(err, user) {
            if (err) console.log(err);
            if (user) {
                return res.redirect('/');
            } else {
                if (userName == 'root') {
                    _user = new User({
                        name: userObj.name,
                        password: userObj.password,
                        email: userObj.email,
                        phone: userObj.phone,
                        role: 4
                    });
                    _user.avator = _user.gravatar(200);
                    _user.save(function(err, user) {
                        if (err) console.log(err);
                        res.json(200,{
                                success: 1,
                                username: user.name,
                                role: user.role
                            })
                    })

                } else {
                    Form.find({}, function(err, forms) {
                        var formsId = [];
                        forms.forEach(function(x) {
                            formsId.push(x._id);
                        })
                        console.log(formsId);
                        _user = new User({
                            name: userObj.name,
                            password: userObj.password,
                            email: userObj.email,
                            phone: userObj.phone,
                            role: 2,
                            forms: [].concat(formsId)
                        });
                        _user.avator = _user.gravatar(200);
                        _user.save(function(err, user) {
                            if (err) console.log(err);
                            // res.redirect('/login');
                            res.json(200,{
                                success: 1,
                                username: user.name,
                                role: user.role
                            })
                        })
                    })
                }

            }
        })
        
    }
};


exports.logout = function(req, res) {
    delete req.session.user;
    req.logout();
    res.json(200);
};

exports.detail = function(req, res) {
    var name = req.session.user.name;
    User.findOne({
        name: name
    }, function(err, user) {
        if (err) console.log(err);
        console.log(user);
        res.render('userdetail', {
            title: '用户资料详情页',
            user: user
        })
    })
};

exports.list = function(req, res) {
    User.find({})
        .populate('lab','name')
        .select('name phone email role lab')
        .exec(function(err, users) {
            if (err) console.log(err);
            res.json(users);
        })

};

exports.del = function(req, res) {
    var userid = req.query.id;
    var userOnline = req.session.user;
    if (userOnline.role == 4) {
        Lab.find({}, function(err, labs) {
            for (var index in labs) {
                Lab.update({
                    _id: labs[index]._id
                }, {
                    $pull: {
                        members: userid
                    }
                })
            }
        })
        User.remove({
            _id: userid
        }, function(err, user) {
            if (err) console.log(err);
            res.json({
                success: 1
            });
        })
    } else {
        res.json({
            success: 0
        });
    }

};

exports.signinRequired = function(req, res, next) {
    var user = req.session.user;
    if (!user) {
        return res.redirect('/login');
    }
    next();
};

exports.find = function(req, res) {
    var name = req.query.name;
    console.log(name);
    User.findOne({
        name: name
    }, function(err, user) {
        // console.log(user);
        if (!user) {
            res.json(false)
        } else {
            res.json(true)
        }
    })
}

exports.getLoginUser = function(req, res) {
    res.json(req.session.user)
}

exports.update = function(req,res){
    var id = req.query.id;
    User.find({_id: id})
        .select('name email phone role')
        .limit(1)
        .exec(function(err,user){
            if(err) console.log(err);
             res.json(user);
        })

}

exports.profile = function(req,res){
    var user = req.session.user;
    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone
    });
}

exports.add = function(req,res){
    var users = req.body;

    async.mapSeries(users,function(item,callback){
        User.findOne({name: item.name},function(err,user){
            if(err) console.log(err);
            if(user){
                callback(item.name);
            }else{
                Form.find({}, function(err, forms) {
                    var formsId = [];
                    forms.forEach(function(x) {
                        formsId.push(x._id);
                    })
                    var _user = new User({
                        name: item.name,
                        password: item.password,
                        lab: item.lab,
                        role: 2,
                        forms: [].concat(formsId)
                    });
                    _user.avator = _user.gravatar(200);
                    _user.save(function(err, user) {
                        if (err) console.log(err);
                        callback(null,item.name)
                    })
                })
            }
        })
    },function(err, results){
        var vals = results;
        if(!err){
            res.json({success: 1})
        }else{
            vals = vals.filter(function(x){return x !== undefined && x !== null;});
            // async.series([
            //     function(cb){
            //        cb(null,{name: err,msg:'用户已存在！'})
            //     },
            //     function(cb){
                    
            //     }
            //     ],function(err,results){
            //         console.log(results);
            //     })
            
            vals.push({name: err,msg:'用户已存在！'})
            // console.log(vals);
            res.json({
                error : 1,
                msg: vals
            })
        }
    })
}