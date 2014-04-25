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
    console.log("will serialize: " + user.cereal)
    done(null, user.cereal);
});

passport.deserializeUser(function(cereal, done) {
  findByKey(cereal)
  .then(function (result){
    done(result[0], result[1])
  });
});

// passport.serializeUser(function(user, done) {
//     done(null, user);
// });
// passport.deserializeUser(function(user, done) {
//     done(null, user)
// });
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
app.get('/', isLoggedIn, function (req, res){
    res.sendfile('./public_html/index.html');
});

// Serve login Page
app.get('/login', function (req, res) {
  res.sendfile('./public_html/login.html');
});


// Github authentication
app.get('/auth/github', passport.authenticate('github'), function (req, res){});
// Successful authentication, redirect home.
app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/' }), function(req, res) {
    res.redirect('/');
});

// route to send user information to the front end
app.get('/user', function (req, res){
  res.json(200, req.user);
})

//logout
app.get('/logout', function(req, res){
  req.session.destroy(function () {
    console.log("LOGGED OUT!");
    //Inside a callback so don't redirect before fully logged out
    res.redirect('/login'); 
  });
})

// get posts from database
app.get('/posts', isLoggedIn, function(req, res){
  console.log("GETTING /POSTS");
  var postsList = [];
  
  db.search('testPosts', 'post*')
  .then(function (result) {
    var postsReturned = result.body.results;
    postsReturned.forEach(function (item){
      item.value.timeStamp = parseInt(item.value.timeStamp, 10);
    });
    postsReturned.sort(function(a, b) {
      if (a.value.timeStamp > b.value.timeStamp) return -1;
      if (a.value.timeStamp < b.value.timeStamp) return 1;
      return 0;
    });
    postsReturned.forEach(function(item){
      item.value.timeStamp = new Date(item.value.timeStamp);
      console.log(item.value);
      postsList.push(item.value);
    })
    console.log(postsList);
  })
  .then(function () {
    res.json(200, postsList);
  })
  .fail(function (err){
    console.log("GET ERRRRR:" + err.body)
  });
  
});

// app.get('posts/*', isLoggedIn, function (req, res){
//   db.get('testPosts', 'post' + req.body.id)
//   .then(function (result){
//     res.json(200, result.body.results);
//   })
//   .fail(function (err){
//     console.log(err);
//   })
// });

app.post('/posts/*', isLoggedIn, function (req, res) {
  // console.log(req.body);
  // console.log(req.body.id); //need to fix so only getting back the part after the colon (right now it is included)
  db.put('testPosts', 'post' + req.body.id, req.body)
  .then(function (result){
    console.log("POST HAS BEEN POSTed IN DATABASE");
    res.json(200, result.request.body.toString());
  })
  .fail(function(err){
    console.log("POST ERRRRR:" + err.body);
  });
});

app.put('/posts/*', isLoggedIn, function (req, res) {
  // console.log(req.body);
  // console.log(req.body.id); //need to fix so only getting back the part after the colon (right now it is included)
  db.put('testPosts', 'post' + req.body.id, req.body)
  .then(function (){
    console.log("POST HAS BEEN UPDATED IN DATABASE");
    res.end();
  })
  .fail(function(err){
    console.log("PUT ERRRRR:" + err.body);
  });
});

app.delete('/posts/*',isLoggedIn,  function (req, res){
  db.remove('testPosts', post + req.body.id, true)
  .then(function (result) {
    console.log("SUCCESSFULLY REMOVED FROM DB");
  })
  .fail(function (err) {
    console.log("delete ERRRRR:" + err.body);
  })
});

// //POST posts to database
// // NEED TO ADD FILTER SO NO WIERDOS RUIN OUR SITE!!!
// app.post('/posts/:id', function (req, res){
//   console.log(req.body);
//   console.log(req.params.id); //need to fix so only getting back the part after the colon (right now it is included)
//   db.put('testPosts', 'post' + req.params.id, req.body)
//   .then(function (){
//     console.log("POST HAS BEEN POSTed IN DATABASE");
//     res.end();
//   })
//   .fail(function(err){
//     console.log(err);
//   });
// });

// // POST method to update a post in the database when a repy is made to it
// app.post('/posts/:id/reply', function (req, res){
//   console.log(req.body);
//   db.put('testPosts', 'post' + req.params.id, req.body)
//   .then(function (){
//     console.log("POST HAS BEEN POSTed IN DATABASE WITH NEW REPLY");
//     res.end();
//   })
//   .fail(function(err){
//     console.log(err);
//   });
// })

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

    db.get('testUsers', key)
      .then(function (result){
        //in this case the user already exists in the database we just need to return them
            // console.log("FOUND CEREAL!!" + result.body)
            console.log("FOUND CEREAL!!");
            deferred.resolve([null, result.body]);
      })
      //in this case the user is not already in the database and needs to be added before it can be returned
      .fail(function (err) {
        console.log("NO CEREAL FOUUUUUUNNNND!");
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
          console.log("USER NOW: " + user);
          // put the user into our DB if it's not currently there
          db.put('testUsers', key, user)
          .then(function () {
            console.log("USER: " + user);
            deferred.resolve([null, user]);
          })
          .fail(function (err) {
            console.log("PUT FAIL:" + err.body);
            deferred.resolve([err, user]);
          });
      });

  return deferred.promise;
}

findByKey = function (key){
  var deferredKey = Q.defer();

    db.search('testUsers', key)
      .then(function (result){
        //in this case deserialized user key did match the one in database
        if (result.body.results[0] !== undefined) {
          db.get('testUsers', key)
            .then(function (result){
            // console.log("from the get deserialize:")
            // console.log(result.body);
            deferredKey.resolve([null, result.body]);
            })
            .fail(function (err){
              console.log("USER GET ERRRR: " + err.body);
              deferredKey.resolve([err, false]);
            })
        } 
        //in this case the deserialized user key did NOT match the one in the database
        else{
          var err = "could not deserialize this user, there was no match with database";
          deferredKey.resolve([err, false]);
        }
      })
      .fail(function (err) {
        console.log("USER SEARCH ERRRR: " + err.body);
      });

  return deferredKey.promise;
}