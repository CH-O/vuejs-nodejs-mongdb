var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var ArticleSchema = new Schema({
	classify:{
		type: ObjectId,
		ref: 'Classify'
	},
	title:{type: String},          
	content:{type: String},
	meta:{
		createAt:{
			type: Date,
		},
		updateAt:{
			type: Date,
		}
	}
})

module.exports = mongoose.model('Article',ArticleSchema,'article');