var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
var session = require('express-session');

app.use(cookieParser());

app.use(session({
  secret: 'kuda',
  cookie: { secure: false }
}))

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', address+ ':3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE, navPlugin');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

var server = app.listen(3001, function () {
	var port = server.address().port;

  	console.log('App listening at port:', port);
});

app.get('/', function(req, res) {
	res.redirect('/index.html');
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
	req.session.balance = req.query.data.balance;
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

app.use(express.static(__dirname + '/public',{ redirect : false }));