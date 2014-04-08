var express  = require('express'),
    passport = require('passport'),
    path     = require('path');

var app      = express();

var port     = process.env.PORT || 5000;

// configure Express
app.use(express.logger());
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.session({ secret: 'cookie monster' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public_html')));

app.get('/', function(req, res){
    res.sendfile('./public_html/index.html');
});

app.listen(port);
console.log('The magic happens on port ' + port);