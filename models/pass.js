var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  pass: { //des pass 1 jour, 2j ou 3j
    type: Object,
    required: true
  },
  //nom prénom date de naissance, adresse, paymentId, 
  address: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  paymentId: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Ticket', schema);