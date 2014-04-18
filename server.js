var express  = require('express'),
    passport = require('passport'),
    path     = require('path'),
    GitHubStrategy = require('passport-github').Strategy,
    Q = require('q');

var db = require('orchestrate')(process.env.ORCHESTRATE_API_KEY);

var app      = express();
var port     = process.env.PORT || 5000;

// ===========================
// PASSPORT
// ===========================
passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(user, done) {
    done(null, user)
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
                .then(function (result) {
                  console.log("made it authorization!");
                  // console.log("user: " + result[1]);
                  return done(result[0], result[1]);
                });
    }
));

// ===========================
// EXPRESS
// ===========================
app.use(express.logger());
app.use(express.cookieParser("SECRET"));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.session({ secret: "SECRET" }));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public_html')));
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  if ('OPTIONS' == req.method) {
       res.send(200);
   } else {
       next();
   }
});

// ===========================
// ROUTES
// ===========================

// Homepage
app.get('/', isLoggedIn, function(req, res){
    res.sendfile('./public_html/index.html');
});

// Serve login Page
app.get('/login', function (req, res) {
  res.sendfile('./public_html/login.html');
});
// When the 'Login' button is clicked send on to user auth with GitHub
app.post('/login', function (req, res) {
    res.redirect('/auth/github');
  });

// Github authentication
app.get('/auth/github', passport.authenticate('github'), function (req, res){});
// Successful authentication, redirect home.
app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/' }), function(req, res) {
    res.redirect('/');
});

//logout
app.get('/logout', function(req, res){
  req.session.destroy(function () {
    console.log("LOGGED OUT!");
    //Inside a callback so don't redirect before fully logged out
    res.redirect('/login'); 
  });
})

app.listen(port);
console.log('The magic happens on port ' + port);

// ===========================
// HELPERS
// ===========================

// route middleware to makse sure user is logged in
function isLoggedIn(req, res, next) {
  // if they are logged in let them proceed
  if (req.isAuthenticated()){
    console.log("Authenticated!");
    return next();
  }
  // if they aren't redirect to login
  else{
    console.log("Authorization failed!");
    res.redirect('/login');
  }
}

// access to database where users are stored for GitHub.Strategy
authUserGit = function (profile) {
  var deferred = Q.defer();

  // use the provider and the user (incase we support other providers down the road)
  var key = profile.provider + '-' + profile.username;

    db.search('testUsers', key)
      .then(function (result){
        //in this case the user already exists in the database we just need to return them
        if (result.body.results[0] !== undefined) {
          db.get('testUsers', key)
            .then(function (result){
            deferred.resolve([null, result.body]);
            })
            .fail(function (err){
              console.log(err.body);
              deferred.resolve([err, false]);
            })
        } 
        //in this case the user is not already in the database and needs to be added before it can be returned
        else{ 
        // the user data we want to store. this is mostly to clean up any extra data we don't need
          var user = {
            cereal:      key, 
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
          db.put('testUsers', key, user)
          .then(function () {
            console.log("USER: " + user);
            deferred.resolve([null, user]);
          })
          .fail(function (err) {
            console.log(err.body);
            deferred.resolve([err, user]);
          });
        }
      })
      .fail(function (err) {
        console.log(err.body);
      });

  return deferred.promise;
}
