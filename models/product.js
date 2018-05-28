var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    date: [{type: Date}],
    isAvailable: {type: Boolean, required: true}
});

var Product = module.exports = mongoose.model('Product', schema);

module.exports.listAllProducts = function() {
	return Product.find({}).exec();
}
