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

var Ticket = module.exports = mongoose.model('Ticket', schema);


// retourne le nombre de place libres à [jour]
module.exports.isAvailable = function(jour) {
	return Ticket.count({ date: jour, pass: null }).exec();
}

// attribue un pass à un ticket et retourne le ticket
module.exports.givePass = function(jour, pass) {
	console.log('je suis dans givePass');
	return Ticket.findOneAndUpdate(
		{$and: [{ date: jour }, {pass: null}]},
		{ pass: pass }, 
		{ new : true }
	).exec();
}

		
		
	
	
