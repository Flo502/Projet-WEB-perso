var express = require('express');
var passport = require('passport');
var router = express.Router();
var Cart = require('../models/cart');
var Product = require('../models/product');
//var Order = require('../models/order');
// Get Homepage
router.get('/', function(req, res) {
  res.render('accueil');
});

router.get('/', function(req, res) {
  res.render('index');
});

//doc technique
router.get('/doc1', function(req, res) {
  res.render('doc1');
});
router.get('/doc2', function(req, res) {
  res.render('doc2');
});
router.get('/doc3', function(req, res) {
  res.render('doc3');
});
router.get('/doc4', function(req, res) {
  res.render('doc4');
});
router.get('/doc5', function(req, res) {
  res.render('doc5');
});


router.get('/lineup', function(req, res) {
  res.render('line_up');
});

router.get('/Howto', function(req, res) {
  res.render('howto');
});

router.get('/compte', isLoggedIn, function(req, res) {
  var User = req.user
  res.render('account', {
    name: User.lastname,
    firstname: User.firstname,
    email: User.email,
    username: User.username
  });
});

router.get('/checkout', isLoggedIn, function(req, res, next) {
  if (!req.session.cart) {
    return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  var errMsg = req.flash('error')[0];
  res.render('shop/checkout', {
    total: cart.totalPrice,
    errMsg: errMsg,
    noError: !errMsg
  });
});

router.post('/checkout', isLoggedIn, function(req, res, next) {
  if (!req.session.cart) {
    return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);

  var stripe = require("stripe")(
    "sk_test_DkuKcEWqtOzmnm7oawN2uJDI"
  );

  stripe.charges.create({
    amount: cart.totalPrice * 100,
    currency: "usd",
    source: req.body.stripeToken, // obtained with Stripe.js
    description: "Test Charge"
  }, function(err, charge) {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('/checkout');
    }
    var order = new Order({
      user: req.user,
      cart: cart,
      address: req.body.address,
      name: req.body.name,
      paymentId: charge.id
    });
    order.save(function(err, result) {
      req.flash('success', 'Successfully bought product!');
      req.session.cart = null;
      res.redirect('/');
    });
  });
});


router.get('/ping', (req, res) => {
  res.status(200).send("pong!");
});

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.oldUrl = req.url;
  res.redirect('/users/login');
}