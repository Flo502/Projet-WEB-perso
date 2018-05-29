const express = require('express');
const router = express.Router();

var Pass = require('../models/pass');
var Ticket = require('../models/ticket');
var Product = require('../models/product');

router.get('/billetterie', isLoggedIn, function(req, res) {
  Product.listAllProducts().then(function(docs, err) {
    res.json(docs);
  });
});

router.get('/billetterie/:idProduct', isLoggedIn, function(req, res) {
  Product.listAllProducts().then(function(docs, err) {
    res.json(docs);
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/users/login');
}

module.exports = router;