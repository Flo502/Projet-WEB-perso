var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
	pass: {
		type: Schema.Types.ObjectId,
		ref: 'Pass'
	},
	date: {
		type: Date,
		required: true
	},
	
});

module.exports = mongoose.model('Ticket', schema);
