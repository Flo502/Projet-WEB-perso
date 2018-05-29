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
  res.render('login', {
    user: req.user,
    error: req.flash('error')
  });
});

router.get('/profile', isLoggedIn, function(req, res, next) {
  User.find({
    user: req.user
  }, function(err, orders) {
    if (err) {
      return res.write('Error!');
    }
    var cart;
    orders.forEach(function(order) {
      cart = new Cart(order.cart);
      order.items = cart.generateArray();
    });
    res.render('user/profile', {
      orders: orders
    });
  });
});

// Register User
router.post('/register', function(req, res) {
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;

  // Validation
  req.checkBody('firstname', 'Prénom requis').notEmpty();
  req.checkBody('lastname', 'Nom requis').notEmpty();
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
            lastname: lastname,
            firstname: firstname,
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
  function(req, res, next) {
    if (req.session.oldUrl) {
      var oldUrl = req.session.oldUrl;
      req.session.oldUrl = null;
      res.redirect(oldUrl);
    } else {
      res.redirect('/user/profile');
    }
  });


router.get('/logout', isLoggedIn, function(req, res, next) {
  req.logout();
  req.flash('success_msg', 'Vous êtes déconnectés');
  req.session.save((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

router.use('/', notLoggedIn, function(req, res, next) {
  next();
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
    "pk_test_bpviEB3yiRjrKRvwt9cm5riu"
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

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.oldUrl = req.url;
  res.redirect('/users/login');
}

function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}
