var mongoose = require('mongoose')
var bcrypt = require('bcrypt')
var SALT_WORK_FACTOR = 10

var UserSchema = new mongoose.Schema({
	username:{
		type:String,
		uniqer:true
	},
	password:String,
	role:{
		type:Number,
		default: 0
	},
	meta:{
		createAt:{
			type: Date
		},
		updateAt:{
			type: Date,
			default:0
		}
	}
})
UserSchema.methods = {
	comparePassword: function(_password, cb) {
		bcrypt.compare(_password, this.password, function(err, isMatch) {
			if(err) return cb(err)
			cb(null, isMatch)
		})
	}
}
UserSchema.pre('save',function(next) {
	var user = this
	bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt) {
		if (err) return next(err)
		bcrypt.hash(user.password,salt,function(err,hash){
			if (err) return next(err)
			user.password = hash
			next()
		})
	})
})
module.exports = mongoose.model('User', UserSchema, 'user')