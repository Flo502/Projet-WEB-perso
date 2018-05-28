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
module.exports.isAvailable = function(jour, callback) {
	Ticket.count({ date: jour, pass: '' }, callback);
}

// attribue un pass à un ticket et retourne le ticket
module.exports.givePass = function(jour, pass) {
	Ticket.findOneAndUpdate(
		{$and: [{ dsate: jour }, {pass: ''}]},
		{ pass: pass }, 
		{ new : true },
		function (err, ticket) {
			if (err) return handleErr(err);
			return ticket;
		}
	);
}

		
		
	
	
