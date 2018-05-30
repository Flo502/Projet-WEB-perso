const express = require('express');
const router = express.Router();

var Pass = require('../models/pass');
var Ticket = require('../models/ticket');
var Product = require('../models/product');
var User = require('../models/user');

router.get('/billetterie', isLoggedIn, async function(req, res) {
  //TODO: vérifier qu'il reste assez de ticket et update la collection
  await Product.getId('Pass 3 jours').then(function(docs, err) {
    res.render('Billetterie', {id: docs._id});
  });
});

router.get('/billetest', async function(req, res) {
	Product.listAllProducts().then( function(docs, err) {
		res.json(docs);
	});	
});

router.get('/Pass1', isLoggedIn, async function(req, res) {
  var id1 = await Product.getId('Pass J1').then(function(docs, err) {
    if (err) console.log(err);
    console.log('j1', docs);
    return docs;
  });
  var id2 = await Product.getId('Pass J2').then(function(docs, err) {
    if (err) console.log(err);
    console.log('j2', docs);
    return docs;
  });
  var id3 = await Product.getId('Pass J3').then(function(docs, err) {
    if (err) console.log(err);
    console.log('j3', docs);
    return docs;
  });
  res.render('Pass1', {id1 : id1._id, id2 : id2._id, id3 : id3._id});
});

router.get('/Pass2', isLoggedIn, async function(req, res) {
	//TODO: in pass2.handlebars, add pass J1J3
  var id1 = await Product.getId('Pass J1J2').then(function(docs, err) {
    if (err) console.log(err);
    console.log('j1j2', docs);
    return docs;
  });
  var id2 = await Product.getId('Pass J2J3').then(function(docs, err) {
    if (err) console.log(err);
    console.log('j2j3', docs);
    return docs;
  });
  var id3 = await Product.getId('Pass J1J3').then(function(docs, err) {
    if (err) console.log(err);
    console.log('j1j3', docs);
    return docs;
  });
  res.render('Pass2', {id1 : id1._id, id2 : id2._id, id3 : id3._id});
});

router.get('/billetterie/:idProduct', isLoggedIn, function(req, res) {
  res.render('achat', {idProduct: req.params.idProduct});
});

router.post('/billetterie/:idProduct', isLoggedIn, async function(req, res) {

	var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var address = req.body.address;
  var birthdate = req.body.birthdate;

  req.checkBody('firstname', 'Prénom requis').notEmpty();
  req.checkBody('lastname', 'Nom requis').notEmpty();
  req.checkBody('address', 'Adresse requise').notEmpty();
  req.checkBody('birthdate', 'Date de naissance requise').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    res.render('achat', {
      errors: errors
    });
  } else {
		console.log(req.params.idProduct);
		var date = await Product.getDate(req.params.idProduct).then(function(doc, err) {
		if (err) { console.log(err); return;}
		return doc;
		}).catch(function(err) {
			console.log(err);
		});

		var user = req.user;

		var newPass = await (new Pass ({
			firstname: firstname,
			lastname: lastname,
			address: address,
			birthdate: birthdate,
			user: user,
			pass: []
		})).save().then(function(doc,err) {
			return doc;
		});

		console.log(date.dates);
		console.log('length', date.dates.length);

		
		for (var i = 0; i< date.dates.length; i++) {
			console.log('iter');
			console.log('date', i, date.dates[i]);
			await Ticket.givePass(date.dates[i], newPass._id).then(function(doc, err){
				Pass.addTicket(newPass._id, doc._id);
				console.log('ticket');
				console.log(doc);
				console.log(err);
			}).catch(function(err) {
				console.log(err);
			});
		}

		User.updatePass(user.username, newPass._id);

		console.log(req.user);
		console.log(req.user.passes);

		req.flash('success_msg', 'Le billet a été acheté');
		res.redirect('/');
	}

});



function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/users/login');
}

module.exports = router;
