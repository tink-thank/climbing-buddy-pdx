var Postings = require('./collections/postings.js');

var FormView = require('./views/form-view.js');
var PostColView = require('./views/posting-collection-view.js');

$.getJSON('/user', function (data) {
  
  var user = {}
  window.user = user;
  user.data = data;
  
});

var TopBar = require('./models/topbar.js')
var TopBarView = require('./views/topbar-view.js');

$(function () {   

  var ClimbingRouter = Backbone.Router.extend({});
  var myClimbingRouter = new ClimbingRouter;

  Backbone.history.start();  
  
  var postings = new Postings();
  postings.fetch();

  var topBar = new TopBar()
  var topBarView = new TopBarView({model: topBar});

  var formView = new FormView({collection:postings});
  var appView = new PostColView({collection:postings});

  var app = {}
  window.app = app;    
  app.postings = postings;


})