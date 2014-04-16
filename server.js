var express  = require('express'),
    passport = require('passport'),
    path     = require('path'),
    GitHubStrategy = require('passport-github').Strategy,
    Q = require('q');
var db = require('orchestrate')(process.env.ORCHESTRATE_API_KEY);

// db.put('testUsers', 'test1', {name: 'Jhenna'});

// findByKey = function (key){
//   var deferredKey = Q.defer();

//     db.search('testUsers', key)
//       .then(function (result){
//         //in this case deserialized user key did match the one in database
//         if (result.body.results[0] !== undefined) {
//           db.get('testUsers', key)
//             .then(function (result){
//             console.log("from the get deserialize:")
//             console.log(result.body);
//             deferredKey.resolve([null, result.body]);
//             })
//             .fail(function (err){
//               console.log(err.body);
//               deferredKey.resolve([err, false]);
//             })
//         } 
//         //in this case the deserialized user key did NOT match the one in the database
//         else{
//           var err = "could not deserialize this user, there was no match with database";
//           deferredKey.resolve([err, false]);
//         }
//       })
//       .fail(function (err) {
//         console.log(err.body);
//       });

//   return deferredKey.promise;
// }

authUserGit = function (profile) {
  var deferred = Q.defer();

  // use the provider and the user (incase we support other providers down the road)
  var key = profile.provider + '-' + profile.username;

    db.search('testUsers', key)
      .then(function (result){
        if (result.body.results[0] !== undefined) { //in this case the user already exists in the database we just need to return them
          db.get('testUsers', key)
            .then(function (result){
            // console.log("from the get:")
            // console.log(result.body);
            deferred.resolve([null, result.body]);
            })
            .fail(function (err){
              console.log(err.body);
              deferred.resolve([err, false]);
            })
        } 
        else{ //in this case the user is not already in the database and needs to be added before it can be returned
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
            // add the key to the session data
            console.log("USER: " + user);
            // user.key = key;
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

var app      = express();

var port     = process.env.PORT || 5000;

// passport.serializeUser(function(user, done) {
//     console.log("will serialize: " + user.cereal)
//     done(null, user.cereal);
// });

// passport.deserializeUser(function(cereal, done) {
//   findByKey(cereal)
//   .then(function (result){
//     done(result[0], result[1])
//   });
// });
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
        process.nextTick(function () {// on successful auth
                authUserGit(profile)
                .then(function (result) {
                  console.log("made it authorization!");
                  // console.log("user: " + result[1]);
                  return done(result[0], result[1]);
                });
        });
    }
));

// configure Express
app.use(express.logger());
app.use(express.cookieParser("SECRET"));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.session({ secret: "SECRET" }));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public_html')));

// ===========================
// ROUTES
// ===========================

// Homepage
app.get('/', isLoggedIn, function(req, res){
    res.sendfile('./public_html/index.html');
});

// Github authentication
app.get('/auth/github', passport.authenticate('github'), function(req, res){});

app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/' }), function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
});

app.listen(port);
console.log('The magic happens on port ' + port);

// route middleware to makse sure user is logged in
function isLoggedIn(req, res, next) {
  // console.log(("req.session: ").toUpperCase());
  // console.log(req.session);
  // console.log(("req._passport: ").toUpperCase());
  // console.log(req._passport);
  // console.log(("req.user: ").toUpperCase());
  // console.log(req.user);
  // if user is authenticated in the session proceed
  if (req.isAuthenticated()){
    console.log("Authenticated!");
    return next();
  }
  else{
    console.log("Authorization failed!");
    // if they aren't redirect to login
    res.redirect('/auth/github');
  }
  
}
