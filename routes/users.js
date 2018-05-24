const express = require('express');
const router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

// Register
router.get('/register', function(req, res) {
  res.render('register');
});

// Login
router.get('/login', function(req, res) {
  res.render('login');
});

// Register User
router.post('/register', function(req, res) {
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;

  // Validation
  req.checkBody('name', 'Nom requis').notEmpty();
  req.checkBody('email', 'Email requis').notEmpty();
  req.checkBody('email', 'Email invalide').isEmail();
  req.checkBody('username', "Nom d'utilisateur requis").notEmpty();
  req.checkBody('password', 'Mot de passe requis').notEmpty();
  req.checkBody('password2', 'La confirmation du mot de passe ne correspond pas').equals(req.body.password);

  var errors = req.validationErrors();

  if (errors) {
    res.render('register', {
      errors: errors
    });
  } else {
    //checking for email and username are already taken
    User.findOne({
      username: {
        "$regex": "^" + username + "\\b",
        "$options": "i"
      }
    }, function(err, user) {
      User.findOne({
        email: {
          "$regex": "^" + email + "\\b",
          "$options": "i"
        }
      }, function(err, mail) {
        if (user || mail) {
          res.render('register', {
            user: user,
            mail: mail
          });
        } else {
          var newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password
          });
          User.createUser(newUser, function(err, user) {
            if (err) throw err;
            console.log(user);
          });
          req.flash('success_msg', 'Vous êtes enregistrés, vous pouvez désormais vous connecter');
          res.redirect('/users/login');
        }
      });
    });
  }
});

// passport config
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.getUserByUsername(username, function(err, user) {
      if (err) throw err;
      if (!user) {
        return done(null, false, {
          message: 'Utilisateur inconnu'
        });
      }

      User.comparePassword(password, user.password, function(err, isMatch) {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, {
            message: 'Mot de passe incorrect'
          });
        }
      });
    });
  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
  }),
  function(req, res) {
    res.redirect('/');
  });

router.get('/logout', function(req, res) {
  req.logout();

  req.flash('success_msg', 'You are logged out');

  res.redirect('/users/login');
});

module.exports = router;
