var express  = require('express'),
    passport = require('passport'),
    path     = require('path'),
    GitHubStrategy = require('passport-github').Strategy,
    Q = require('q');
var db = require('orchestrate')(process.env.ORCHESTRATE_API_KEY);

// db.put('testUsers', 'test1', {name: 'Jhenna'});

authUserGit = function (profile) {
  var deferred = Q.defer();

  // use the provider and the user (incase we support other providers down the road)
  var key = profile.provider + '-' + profile.username;

  // the user data we want to store. this is mostly to clean up any extra data we don't need
  var user = {
    provider:    profile.provider,
    id:          profile.id,
    displayName: profile.displayName,
    username:    profile.username,
    profileUrl:  profile.profileUrl,
    emails:      profile.emails,
    avatar:      profile._json.avatar_url,
    githubData:  profile._json
  };

  // put the user into our DB if it's not currently there
  // this uses Orchestrate's condition PUT functionality
  db.put('testUsers', key, user, false)
  .then(function () {
    // add the key to the session data
    user.key = key;
    deferred.resolve(user);
  })
  .fail(function () {
    deferred.reject();
  });

  return deferred.promise;
}

var app      = express();

var port     = process.env.PORT || 5000;

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

passport.use(new GitHubStrategy(
    {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK
    },
    function(accessToken, refreshToken, profile, done) {
        // on successful auth
        authUserGit(profile)
        .then(function (user) {
          done(null, user);
        });
    }
));

// configure Express
app.use(express.logger());
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.session({ secret: 'climbing master' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public_html')));

app.get('/', function(req, res){
    res.sendfile('./public_html/index.html');
});

app.get('/auth/github', passport.authenticate('github'));

app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/' }), function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
});

// db.get("testUsers", "github-trippel")
//   .then(function (result){
//     console.log(result.body.avatar);
//   }).fail(function(err){console.log(err)});

app.listen(port);
console.log('The magic happens on port ' + port);
