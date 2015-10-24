var express = require('express');
var jwt = require('jwt-simple');
var bcrypt = require('bcrypt');
var _ = require('lodash');
var User = require('./user');

var app = express();

app.use(require('body-parser').json());

var users = [
	{ username: 'denshi', password: '$2a$10$oyrRVUus0Zo66jYjew9sneM47Sv/AFnZ0N7460bPJg/tkn0ylEPfu' }
];	


var secret = 'veganmulligatawnysoup';

function findUserByUsername(username) {
	return _.find(users, { username: username });
}
function validateUser(user, password, cb) {
	bcrypt.compare(password, user.password, cb);
}



app.post('/session', function(req, res) {
	var user = findUserByUsername(req.body.username);
	validateUser(user, req.body.password, function(err, valid) {
		if(err || !valid) {
			return res.send(401);
		}
		var token = jwt.encode({username: user.username}, secret);
		res.json(token);
	});	
});

app.post('/user', function(req, res, next) {
	var user = new User({ username: req.body.username });
	bcrypt.hash(req.body.password, 10, function(err, hash) {
		user.password = hash;
		user.save(function(err, next) {
			if(err) {
				throw next(err);
			}
			console.log(hash);
			res.send(201);
		});

	});
});

app.get('/user', function(req, res) {
	var token = req.headers['x-auth'];
	var user = jwt.decode(token, secret);
	// TODO: get full user details
	res.json(user);
});

app.listen(3000);