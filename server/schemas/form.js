var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var Mixed = Schema.Types.Mixed;

var FormSchema = new Schema({
	form_id: Number,
	form_name: String,
	form_creater:{
		type: ObjectId,
		ref: 'User'
	},
	start: Date,
	end: Date,
	members:[{
		type:ObjectId,
		ref:'User'
	}],
	labs:[{
		type:ObjectId,
		ref:'Lab'
	}],
	form_fields: Mixed,
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

FormSchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}
	next();
})

//静态方法，从模型中调
FormSchema.statics ={
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

module.exports = FormSchema;
