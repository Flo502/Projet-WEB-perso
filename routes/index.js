var express = require('express');
var passport = require('passport');
var router = express.Router();

// Get Homepage
router.get('/', function(req, res) {
  res.render('accueil');
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    //req.flash('error_msg','You are not logged in');
    res.redirect('/users/login');
  }
}

router.get('/', function(req, res) {
    res.render('index');
});

router.get('/lineup', function(req, res) {
    res.render('line_up');
});


router.get('/register', (req, res) => {
  res.render('register', {});
});

router.get('/login', (req, res) => {
  res.render('login', {
    user: req.user,
    error: req.flash('error')
  });
});

router.post('/login', passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: true
}), (req, res, next) => {
  req.session.save((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

router.get('/logout', (req, res, next) => {
  req.logout();
  req.session.save((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

router.get('/ping', (req, res) => {
  res.status(200).send("pong!");
});

module.exports = router;
