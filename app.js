var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
var session = require('express-session');

app.use(session({secret: 'kuda'}));

app.use(cookieParser());

app.use(express.static(__dirname + '/public',{ redirect : false }));

var server = app.listen(3001, function () {
	var port = server.address().port;

  	console.log('App listening at port:', port);
});

app.get('/home', function(req, res) {
	console.log(req.session.email);
	res.json(req.session.email);
});

app.get('/assign-session', function(req, res) {
	req.session.email = req.query.data.email;
	req.session.fullname = req.query.data.fullname;
	req.session.role = req.query.data.role;
	req.session.authority = req.query.data.authority;
	res.json(1);
});

app.get('/check-session', function(req, res) {
	if(req.session.email) {
		res.json(req.session);
	}
	else {
		res.json("no session");
	}
});