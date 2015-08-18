var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var LabSchema = new Schema({
	name:{
		unique:true,
		type:String
	},
	desc: String,
	phone: String,
	members:[{
		type:ObjectId,
		ref:'User'
	}],
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

LabSchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}
	next();
})

//静态方法，从模型中调
LabSchema.statics ={
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

module.exports = LabSchema;
