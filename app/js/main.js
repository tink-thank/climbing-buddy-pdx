var Posting = require('./models/posting.js');

var Postings = require('./collections/postings.js');

var PostingView = require('./views/posting-view.js');
var FormView = require('./views/form-view.js');

var AppView = require('./views/app.js');

//////////////




$(function () {
  
  var formView = new FormView();
  
  var postings = new Postings({});
  var appView = new AppView({collection:postings});
  appView.appendTo('#main');
  
  var app = {};
  window.app = app;
  app.appView = appView;
  app.postings = postings;
  
  Backbone.history.start();
  
});