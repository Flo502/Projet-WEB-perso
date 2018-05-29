const express = require('express');
const router = express.Router();

var Pass = require('../models/pass');
var Ticket = require('../models/ticket');
var Product = require('../models/product');
var User = require('../models/user');

router.get('/billetterie', isLoggedIn, function(req, res) {
  //TODO: vérifier qu'il reste assez de ticket et update la collection
  Product.listAllProducts().then(function(docs, err) {
    res.json(docs);
  });
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
		
		var newPass = new Pass ({
			firstname: firstname,
			lastname: lastname,
			address: address,
			birthdate: birthdate,
			user: user,
			pass: []
		});
		
		console.log(date.dates);
		console.log('length', date.dates.length);
		
		//récupérer tickets: NE MARCHE PAS
		for (var i = 0; i< date.dates.length; i++) {
			console.log('iter');
			console.log('date', i, date.dates[i]); 
			await Ticket.givePass(dateArr[i], newPass).then(function(doc, err){
				newPass.pass.push(doc);
				console.log('ticket');
				console.log(doc);
				console.log(err);
			}).catch(function(err) {
				console.log(err);
			});
		}
		
		console.log('Pass: ',newPass);
		
		await User.updatePass(user.username, newPass).then(function(doc, err) {
			if (err) console.log(err);
		});
		
		console.log(req.user);
		
		req.flash('success_msg', 'Le billet a été acheté');
		res.redirect('/billetterie');
	}
  
});



function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/users/login');
}

module.exports = router;
