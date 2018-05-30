var express = require('express');
var passport = require('passport');
var router = express.Router();

// Get Homepage
router.get('/', function(req, res) {
  res.render('accueil');
});

router.get('/', function(req, res) {
  res.render('index');
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