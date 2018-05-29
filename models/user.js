var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

/* Fichier générant le modèle d'utilisateur à rentrer dans la db
et produisant les fonctions permettant de se balader dans la db
pour les retrouver (et pour les histoire de hash de pwd)*/

// User Schema
var UserSchema = mongoose.Schema({
  username: {
    type: String,
    index: true
  },
  password: {
    type: String
  },
  email: {
    type: String
  },
  firstname: {
    type: String
  },
  lastname: {
    type: String
  },
  passes: [{
	  pass: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Pass'
		}
	}],
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback) {
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
      newUser.password = hash;
      newUser.save(callback);git 
    });
  });
}

module.exports.getUserByUsername = function(username, callback) {
  var query = {
    username: username
  };
  User.findOne(query, callback);
}

module.exports.updatePass = function(username, pass) {
	var query = {
		username: username
	};
	User.findOne(query, 'passes').exec(function (err, doc) {
		doc.passes.push(pass);
		console.log('pass: ', doc);
		
	});;
}

module.exports.getUserById = function(id, callback) {
  User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    if (err) throw err;
    callback(null, isMatch);
  });
}
