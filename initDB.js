var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/RandomFest');
var db = mongoose.connection;
db.once('open', Main);

var Ticket = require('./models/ticket');
var Product = require('./models/product');

var myProducts = require('./product.json');

async function Main() {
	Ticket.remove({}, function (err) { 
		if (err) { console.log(err); return; }

		for (var i = 0; i < 10; i++) {
			new Ticket({ date: '08.01.18'}).save(function(err) {
				if (err) console.log(err);
			});
			new Ticket({ date: '08.02.18'}).save(function(err) {
				if (err) console.log(err);
			});
			new Ticket({ date: '08.03.18'}).save(function(err) {
				if (err) console.log(err);
			});
		}
		
	});

	await Product.remove({}).exec();
	Product.insertMany(myProducts, function(err, docs) { if (err) console.log(err); else console.log('ok')});
}
