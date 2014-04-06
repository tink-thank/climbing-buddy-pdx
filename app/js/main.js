// Models
var Posting = require('./models/posting.js');

// Collections
var Postings = require('./collections/postings.js');

// Views
var PostingView = require('./views/posting-view.js');
var FormView = require('./views/form-view.js');

// View Collections
var AppView = require('./views/app.js');

//Templates


//////////////




$(function () {
  var app = {};
  window.app = app;
  
  var formView = new FormView();
  
  var postings = new Postings({});
  var appView = new AppView({collection:postings});
  
  app.appView = appView;
  app.postings = postings;


  
  
  Backbone.history.start();
  
});