var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var Mixed = Schema.Types.Mixed;

var AnswerSchema = new Schema({
	fromName: String,
	createrId:{
		type:ObjectId,
		ref:'User'
	},
	answerUserId:{
		type:ObjectId,
		ref:'User'
	},
	formId:{
		type:ObjectId,
		ref:'Form'
	},
	form_fields: Mixed,
	checked: Number,
	meta:{
		createAt:{
			type: Date,
			default:Date.now()
		},
		updateAt:{
			type: Date,
			default:Date.now()
		}
	}
});

AnswerSchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}
	next();
})

//静态方法，从模型中调
AnswerSchema.statics ={
	fetch:function(cb){
		return this
				.find({})
				.sort('meta.updateAt')
				.exec(cb)
	},
	findById:function(id,cb){
		return this
				.findOne({_id:id})
				.exec(cb)

	}
}

module.exports = AnswerSchema;
