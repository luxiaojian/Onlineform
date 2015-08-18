var Lab = require('../models/lab');
var User = require('../models/user');
var Form = require('../models/form');
var Answer = require('../models/answer');
var _ = require('underscore');
var async = require('async');

exports.save = function(req, res) {
    var formObj = req.body;
    // console.log(formObj);
    var id = formObj._id;
    var _form;
    if (id) {
        Form.remove({
            _id: id
        }, function(err, form) {
            _form = new Form(formObj);
            _form.save(function(err, form) {
                if (err) console.log(err);
                // console.log('successfully save data!');
                res.json({
                    success: 1
                });
            })
        })
    } else {
        var userId = req.session.user._id;
        Form.findOne({
            form_name: formObj.form_name
        }, function(err, form) {
            if (!form) {
                _form = new Form({
                    form_id: formObj.form_id,
                    form_name: formObj.form_name,
                    form_creater: userId,
                    form_fields: formObj.form_fields,
                    submitted: formObj.submitted
                });
                _form.save(function(err, form) {
                    if (err) console.log(err);
                    User.find({}, function(err, users) {
                            if (err) console.log(err);
                            for (var index in users) {
                                if (users[index].role == 2) {
                                    User.update({
                                        _id: users[index]._id
                                    }, {
                                        $push: {
                                            forms: form._id
                                        }
                                    }).exec();
                                }
                            }
                        })
                        // console.log('successfully save data!');
                    res.json({
                        success: 1
                    });
                })
            }
        })
    }

}

exports.list = function(req, res) {
    Form.find({})
        .populate('form_creater', 'name')
        .exec(function(err, forms) {
            if (err) console.log(err);
            res.json(forms);
        })
}

exports.del = function(req, res) {
    var id = req.query.id;
    // console.log(id);
    if (id) {
        User.find({}, function(err, users) {
            for (var index in users) {
                User.update({
                    _id: users[index]._id
                }, {
                    $pull: {
                        forms: id
                    }
                },
                {
                    $pull: {
                        completeForms: id
                    }
                }).exec();
            }
        })

        Answer.remove({
            formId: id
        }, function(err, forms) {
            if (err) console.log(err);
        })

        Form.remove({
            _id: id
        }, function(err, form) {
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
    var id = req.params.id;
    Form.findById(id, function(err, form) {
        if (err) console.log(err);
        res.json(form);
    })
}

exports.fetch = function(req, res) {
    var id = req.session.user._id;
        User.findOne({
                _id: id
            })
            .populate('forms')
            .exec(function(err, user) {
                // console.log(user.forms);
                // if (user.role == 0) {
                //     res.json(user.forms);
                // }
                if(user){
                    var data = {};
                    if(user.forms.length !== 0){
                        async.map(user.forms,function(item, callback){
                            Answer.find({formId: item._id, answerUserId: id,checked:{$in: ['-1']}})
                                   .populate('createrId','name')
                                   .select('fromName createrId checked meta')
                                   .exec(function(err,answer){
                                        // console.log(answer);
                                        if(answer.length > 0){
                                            data = answer[0];
                                        }else{
                                            // console.log('没有退回的报表！');
                                            data = item;
                                        }
                                        callback(null,data)
                                    })

                        },function(err,results){
                           console.log(err); 
                           // console.log('输出results');
                           // console.log(results);
                           res.json(results);

                        })
                        
                    }

                    // console.log(data);
                    // var count = user.forms.length;
                    // for(var i= 0; i<user.forms.lenth; i++){
                    //     // console.log('第'+ index + '次执行函数');
                    // }
                    
                }
                

            })
}


exports.lasted = function(req, res) {
    Form.findOne()
        .sort({
            'meta.updateAt': -1
        })
        .populate('form_creater', 'name')
        .limit(1)
        .exec(function(err, form) {
            res.json(form);
        })
}
