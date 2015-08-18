var User = require('./controllers/user');
var Lab = require('./controllers/lab');
var Form = require('./controllers/form');
var Answer = require('./controllers/answer');
var Index = require('./controllers/index');

module.exports = function(app){


	// 注销用户
    app.get('/logout', User.signinRequired,User.logout);
	
	app.get('/info',User.signinRequired,Index.info);

	//获取用户详细资料
	app.get('/profile',User.signinRequired,User.profile);
	
	// app.get('/signup',User.signup);
	app.post('/user/signup',User.save);
	app.post('/user/update',User.save);
	// app.post('/user/signin',User.signinRequired,User.signin);
	app.get('/admin/user/list',User.signinRequired,User.list);
	app.post('/admin/user/list',User.signinRequired,User.del);
	app.get('/admin/user/update',User.signinRequired,User.update);
	//管理员添加用户
	app.post('/admin/user/add',User.signinRequired,User.add);
	//查找用户
	app.get('/user/find/name',User.signinRequired,User.find);
	//查找指定名字实验室
	app.get('/admin/lab',User.signinRequired,Lab.find);
	//实验室数据的增删查改
	app.post('/admin/lab',User.signinRequired,Lab.save);
	// app.get('/lab/:id',Lab.detail);
	app.get('/admin/lab/update/:id',User.signinRequired,Lab.update);
	app.get('/admin/lab/list',User.signinRequired,Lab.list);
	app.post('/admin/lab/list',User.signinRequired,Lab.del);

	//实验室添加成员
	app.get('/admin/lab/addMember',User.signinRequired,Lab.addMember);
	// //实验室添加管理员	
	app.post('/admin/lab/addLeader',User.signinRequired,Lab.addLeader);	

	//自定义表单的存贮
	app.post('/admin/form',User.signinRequired,Form.save);
	app.get('/admin/form/list',User.signinRequired,Form.list);
	//拉取最新的报表
	app.get('/form/lasted',User.signinRequired,Form.lasted);
	
	app.post('/admin/form/list',User.signinRequired,Form.del);


	//拉取已经发布当用户还没有填写的报表
	app.get('/common/form/unfinish',User.signinRequired,Form.fetch);
	
	//填写表单答案的存贮
	app.post('/admin/answer',User.signinRequired,Answer.save);



	//express路由注册还分先后顺序，今天才知道
	app.get('/admin/form/:id',User.signinRequired,Form.detail);
	// app.get('/admin/answer',Answer.find);
	app.get('/common/answer/detail',User.signinRequired,Answer.detail);
	
	app.get('/admin/answer/list',User.signinRequired,Answer.list);

	//管理员拉取所有审核过的报表和没有审核过的报表
	app.get('/admin/answer/checked',User.signinRequired,Answer.checked);

	app.post('/common/answer/list',User.signinRequired,Answer.del);
	//拉去用户已经填写好的表单
	app.get('/common/form/finish',User.signinRequired,Answer.finish);
	//管理员审核用户的表单
	app.get('/admin/answer/check',User.signinRequired,Answer.setChecked);
	//管理员审核单个的表单
	app.post('/admin/answer/check/item',User.signinRequired,Answer.setItemChecked);
	//管理员退回单个的表单
	app.post('/admin/answer/sendBack/item',User.signinRequired,Answer.sendBack);

	//成员拉取所有审核过的报表和没有审核过的报表
	app.get('/common/answer/checked',User.signinRequired,Answer.myChecked);
}