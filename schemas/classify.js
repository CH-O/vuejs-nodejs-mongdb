var mongoose = require('mongoose')

var ClassifySchema = new mongoose.Schema({
	name: String,
	meta:{
		createAt:{
			type: Date,
		},
		updateAt:{
			type: Date,
		}
	}
});

module.exports = mongoose.model('Classify',ClassifySchema,'classify');