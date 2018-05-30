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
    type: String
  }
});

var Pass = module.exports = mongoose.model('Pass', schema);

module.exports.createPass = function(newPass, callback) {
  newPass.save(callback);
}

module.exports.addTicket = function(passId, ticketId) {
  console.log('passId: ', passId);
  Pass.findById(passId, 'pass').exec(function(err, doc) {
    doc.pass.push(ticketId);
    console.log('pass: ', doc);
  });
}