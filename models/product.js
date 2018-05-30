var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    dates: [Date],
    isAvailable: {type: Boolean, required: true}
});

var Product = module.exports = mongoose.model('Product', schema);

module.exports.listAllProducts = function() {
	return Product.find({isAvailable: true}).exec();
}

module.exports.getDate = function(id) {
	return Product.findById(id).select('dates').exec();
}

module.exports.getProd = function(prodTitle) {
	return Product.findOne({title: prodTitle}).exec();
}
