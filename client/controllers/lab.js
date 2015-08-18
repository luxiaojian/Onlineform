var Lab = require('../models/lab');
var User = require('../models/user');
var _ = require('underscore');
var async = require('async');


exports.detail = function(req,res){
	var id = req.params.id;
	Lab
		.findOne({_id: id})
		.populate('members','name')
		.populate('leader')
		.exec(function(err,lab){
			console.log(lab);
			res.render('labDetail',{
				lab: lab
			})	
		});
}

exports.save = function(req,res){
	var labObj = req.body;
	var id =labObj._id;
	var _lab;
	console.log(labObj);
	if(labObj._id){
		Lab.findById(id,function(err,lab){
			console.log('lab:' + lab);
			if(err) conssole.log(err);
			_lab = _.extend(lab,labObj);
			_lab.save(function(err,lab){
				if(err) console.log(err);
				console.log('save lab success!');
				res.json({success: 1});
			});
		})
	}else{
		Lab.findOne({name: labObj.name},function(err,lab){
			if(err) console.log(err);
			if(!lab){
				_lab = new Lab(labObj);
				console.log('this _lab:');
				console.log(_lab);
				// var userArray = [];
				for(var index in labObj.members){
					// userArray.push(labObj.members[index]._id);
					User.update({_id: labObj.members[index]._id},{$push: {lab: _lab._id}}).exec();
				}

				_lab.save(function(err,lab){
					if(err) console.log(err);
					console.log('save lab success!');
					res.json({success: 1});
				});
			}
			
		})	
	}
}

exports.update = function(req,res){
	var id = req.params.id;
	Lab.findOne({_id: id})
		.populate('members','name')
		.exec(function(err,lab){
			if(err) console.log(err);
			res.json(lab);
		})
}

exports.addMember = function(req,res){
	User.find({})
		.select('name _id')
		.exec(function(err,users){
			res.json(users);
		});
}

exports.addLeader = function(req,res){
	var leader = req.query.name;
	if(leader){
		User
			.find({name: leader},{_id: 1,name: 1})
			.exec(function(err,user){
				if(err) console.log(err);
				if(!user){
					res.status(404).send('not found users')
				}else{
					res.json(user);
				}
			})
	}
}

exports.list = function(req,res){
	Lab
		.find({})
		.populate('members','name')
		.exec(function(err,labs){
			res.json(labs);
		})
}

exports.del = function(req,res){
	var lab = req.body;
	// console.log(lab);
	// console.log(id);
	// var members = req.query.members;
	// console.log(members);
	if(lab){
		for(var index in lab.members){
			// console.log(members[index]);
			User.update({_id: lab.members[index]._id},{$pull: {lab: lab._id}}).exec();
		}
		Lab.remove({_id: lab._id},function(err,lab){
			if(err){
				console.log(err);
			}else{
				res.json({success: 1})
			}
		})
	}
}

exports.find = function(req,res){
	var name = req.query.name;
	Lab.find({name: new RegExp(name + '.*','i')},function(err,labs){
		if(err) console.log(err);
		if(labs.length > 0){
			async.map(labs,function(item,callback){
				callback(null,{name: item.name,_id:item._id});
			},function(err,results){
				res.status(200).json(results);
			})	
		}else{
			console.log('没有找到相关实验室！');
			res.status(204).send('没有找到相关实验室');
		}
	})
}