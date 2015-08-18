var Lab = require('../models/lab');
var User = require('../models/user');
var Form = require('../models/form');
var Answer = require('../models/answer');
var _ = require('underscore');
var async = require('async');

exports.save = function(req, res) {
    var answerObj = req.body;
    // console.log(answerObj);
    var id = req.session.user._id;
    var _answer;
    if(answerObj._id){
        var formId = answerObj.formId._id;
        Answer.findOne({_id: answerObj._id},function(err,answer){
            // console.log(answer);
            //更新User中的forms 和 completeForms 和 answers
            _answer = _.extend(answer,answerObj);
            _answer.save(function(err, answer) {
                if (err) console.log(err);
                res.json({success: 1});
            });
            Answer.update({_id: answerObj._id},{$set: {checked: 0}}).exec();
            // async.series([
                    
            //     ],function(err,results){
            //     console.log(err);
            // });
            User.update({
                _id: id
            }, {
                $pull: {
                    forms: formId
                }
            }).exec();
            User.update({
                _id: id
            }, {
                $push: {
                    completeForms: formId
                }
            }).exec()
            // console.log('更新User中的forms 和 completeForms!');
            // User.findById(id, function(err, user) {
            // })
        })
    }else{
        var formId = answerObj.formId;
        Answer.findOne({
            formId: formId,
            answerUserId: id
        }, function(err, answer) {
            if (!answer) {
                 _answer = new Answer({
                    fromName: answerObj.form_name,
                    createrId: answerObj.form_creater,
                    answerUserId: id,
                    formId: answerObj.formId,
                    form_fields: answerObj.form_fields,
                    checked: 0
                });

                //更新User中的forms 和 completeForms 和 answers
                User.update({
                    _id: id
                }, {
                    $pull: {
                        forms: formId
                    }
                }).exec();
                User.update({
                    _id: id
                }, {
                    $push: {
                        completeForms: formId
                    }
                }).exec();
                User.update({
                    _id: id
                }, {
                    $push: {
                        answers: _answer._id
                    }
                }).exec();
                // User.findById(id, function(err, user) {
                //     console.log('更新User中的forms 和 completeForms!');
                // })



                _answer.save(function(err, answer) {
                    if (err) console.log(err);
                    // console.log('success save answer!')
                    res.json({success: 1});
                })
            } 
        }) 
    }

}


// exports.list = function(req,res){
// 	Answer.find({})
// 		.populate('formId','form_name')
// 		.populate('userId','name')
// 		.exec(function(err, answers){
// 		if(err) console.log(err);
// 		res.json(answers);
// 	})
// }

exports.del = function(req, res) {
    var id = req.query._id;
    var formId = req.query.formId;
    var userId = req.session.user._id;
    // console.log(id);
    if (id) {
        User.update({
            _id: userId
        }, {
            $pull: {
                completeForms: formId
            }
        }).exec();
        User.update({
            _id: userId
        }, {
            $push: {
                forms: formId
            }
        }).exec();
        // User.findById({
        //     _id: userId
        // }, function(err, user) {
        //     if (user) {
        //     }
        // })
        Answer.remove({
            _id: id
        }, function(err, answer) {
            if (err) {
                console.log(err);
            } else {
                res.json({
                    success: 1
                })
            }
        })
    }
}

exports.detail = function(req, res) {
    var id = req.query.id;
    // console.log(id);
    Answer.findOne({
            _id: id
        })
        .populate('formId', 'form_name')
        .populate('answerUserId', 'name')
        .exec(function(err, answer) {
            if (err) console.log(err);
            res.json(answer);
        })
}

exports.find = function(req, res) {
    var id = req.query.id;
    console.log(id);
    var userId = req.session.user._id;
    console.log(userId);
    Answer.find({
            formId: id,
            form_submitted: true
        })
        .exec(function(err, answers) {
            console.log(answers);
            console.log(answers.length);
            if (answers.length !== 0) {
                res.json({
                    isExist: true
                })
            } else {
                res.json({
                    isExist: false
                })
            }
        })
}

exports.list = function(req, res) {
    Answer.find({checked: 0})
        .populate('answerUserId', 'name avator')
        .populate('formId', 'form_name')
        .exec(function(err, answers) {
            res.json(answers);
        })
}

exports.finish = function(req, res) {
    var user = req.session.user;
    var id = req.session.user._id;
    // console.log(user);
    // User.findOne({_id: id})
    //     .populate('answers', 'fromName meta')
    //     .select('answers')
    //     .exec(function(err, user){
    //         res.json(user.answers);
    //     })
    Answer.find({
            answerUserId: id
        })
        .populate('formId', 'form_name')
        .populate('createrId', 'name')
        .select('formId createrId checked fromName meta')
        .exec(function(err, answers) {
            res.json(answers);
        })
}

exports.setChecked = function(req,res){
    var formName =req.query.formName;
    Answer.find({fromName: formName},function(err,answers){
        for(var index in answers){
            Answer.update({_id: answers[index]._id},{$set:{checked: 1}}).exec();
        }
        res.json({success: 1});
    })
}

exports.setItemChecked = function(req,res){
    var id = req.query.id;
    Answer.update({_id: id},{$set:{checked: 1}}).exec();
    res.json({success: 1});
}

exports.sendBack = function(req,res){
    var id = req.query.id;
    var userId
    Answer.update({_id: id},{$set:{checked: -1}}).exec();
    Answer.findOne({_id: id},function(err, answer){
        User.update({_id: answer.answerUserId},{$pull:{completeForms: answer.formId}}).exec();
        // User.update({_id: answer.answerUserId},{$pull:{answers: answer._id}}).exec();
        User.update({_id: answer.answerUserId},{$push:{forms: answer.formId}}).exec();
        // User.find({_id: answer.answerUserId,forms:{$in: [answer.formId]}})
        //     .exec(function(err, users){
        //         if(users.length == undefined){
        //         }
        //     })
    })

    // Answer.remove({_id: id},function(err, answer){
    //     if(err) console.log(err);
    // })
    res.json({success: 1});
}

exports.checked = function(req,res){
    Answer.find({checked: {$in: ['1','-1']}})
           .populate('formId', 'form_name')
           .populate('createrId', 'name')
           .populate('answerUserId', 'name')
           .sort({'meta.updateAt': -1})
           .select('meta createrId formId answerUserId checked')
           .exec(function(err,answers){
            res.json(answers);
           })
}

exports.myChecked = function(req,res){
    var userId = req.session.user._id;
    Answer.find({answerUserId: userId,checked: {$in: ['1','-1']}})
           .populate('formId', 'form_name')
           .populate('createrId', 'name')
           .populate('answerUserId', 'name')
           .sort({'meta.updateAt': -1})
           .select('meta createrId formId answerUserId checked')
           .exec(function(err,answers){
            res.json(answers);
           })
}