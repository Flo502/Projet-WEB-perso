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

router.get('/compte', isLoggedIn, function(req, res) {
  var User = req.user
  res.render('account', {
    name: User.lastname,
    firstname: User.firstname,
    email: User.email,
    username: User.username
  });
});

router.get('/programmation', function(req, res) {
  res.render('programmation');
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