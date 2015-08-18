var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var crypto = require('crypto');

var bcrypt = require('bcrypt');
var SALT_WORK_FACTORY= 10;
var UserSchema = new Schema({
	name:{
		unique:true,
		type:String
	},
	password: String,
	role: Number,
	avator: String,
	phone: String,
	email: String,
	selected: Boolean,
	forms:[{
		type:ObjectId,
		ref:'Form'
	}],
	completeForms: [{
		type:ObjectId,
		ref:'Form'
	}],
	answers:[{
		type:ObjectId,
		ref:'Answer'
	}],
	lab:[{
		type:ObjectId,
		ref:'Lab'
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

UserSchema.pre('save',function(next){
	var user = this;
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}

	bcrypt.genSalt(SALT_WORK_FACTORY,function(err,salt){
		if(err) return next(err);
		bcrypt.hash(user.password,salt,function(err,hash){
			if(err) return next(err);
			user.password = hash;
			next();
		})
	});
})

//实例方法，从实例中调
UserSchema.methods = {
	comparePassword: function(_password,cb){
		bcrypt.compare(_password,this.password,function(err,isMath){
			if(err){
				return cb(err);
			}
			cb(null,isMath);
		});
	},

	gravatar: function(size){
		if (!size) size = 200;
		if (!this.email) return 'https://gravatar.com/avatar/?s=' + size + '&d=retro';
		var md5 = crypto.createHash('md5').update(this.email).digest('hex');
		return 'https://gravatar.com/avatar/' + md5 + '?s=' + size + '&d=wavatar';
	}
}

//静态方法，从模型中调
UserSchema.statics ={
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

module.exports = UserSchema;
