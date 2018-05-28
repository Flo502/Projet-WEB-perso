const express = require('express');
const router = express.Router();

var Pass = require('../models/pass');
var Ticket = require('../models/ticket');
var Index = require('./index');
var Product = require('../models/product');

router.get('/billetterie', Index.ensureAuthenticated, function(req, res) {
	Product.listAllProducts().then(function(docs, err) {
		res.json(docs);
	});
});

router.get('/billetterie/:idProduct', Index.ensureAuthenticated, function(req, res) {
	Product.listAllProducts().then(function(docs, err) {
		res.json(docs);
	});
});

module.exports = router;
