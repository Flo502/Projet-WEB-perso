var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  pass: [{
	  ticket: {
			type: Schema.Types.ObjectId,
			ref: 'Ticket'
		}
	}],
  address: {
    type: String,
    required: true
  },
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  birthdate: {
		type: Date,
		required: true
	},
  paymentId: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Pass', schema);
