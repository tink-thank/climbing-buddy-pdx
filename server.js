var express  = require('express'),
    passport = require('passport');
var color    = require('colors');

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

//app.get('/', function(req, res){
//    res.send('tested');
//});

app.use(express.static(__dirname + '/public_html'));

app.listen(port);
console.log('[' + 'tink-thank'.green.bold + ']' + ' The magic happens on port '.bold + port.toString().bold)