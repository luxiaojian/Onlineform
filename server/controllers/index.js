
var User = require('../models/user');

exports.info = function(req,res){
	var user = req.session.user;
	// console.log(user);
	res.json({
		name: user.name,
        email: user.email,
        role: user.role,
        avator: user.avator 
	});
}