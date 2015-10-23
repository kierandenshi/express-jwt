var express = require('express');
var jwt = require('jwt-simple');


var app = express();

app.use(require('body-parser').json());

var secret = 'veganmulligatawnysoup';

app.post('/session', function(req, res) {
	var username = req.body.username;
	// TODO: pasword auth things
	var token = jwt.encode({username: username}, secret);
	res.json(token);
});

app.get('/user', function(req, res) {
	var token = req.headers['x-auth'];
	var user = jwt.decode(token, secret);
	// TODO: get full user details
	res.json(user);
});

app.listen(3000);