var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var CommentSchema = new Schema({
	article:{type: ObjectId, ref: 'Article'},
	from:{type: ObjectId, ref: 'User'},
	reply: [{
		from: {type: ObjectId, ref:'User'},
		to: {type: ObjectId, ref: 'User'},
		content: String,
		createAt: Date
	}],     
	content: String,
	createAt: Date
})

module.exports = mongoose.model('Comment',CommentSchema,'comment');