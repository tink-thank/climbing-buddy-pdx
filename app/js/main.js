var Postings = require('./collections/postings.js');
var FormView = require('./views/form-view.js');
var PostColView = require('./views/posting-collection-view.js');

var dataJson = require('../data.json');

$(function () {   
  var app = {}
  window.app = app;    

  var postings = new Postings();
  postings.reset(dataJson);

  var formView = new FormView({collection:postings});
  var appView = new PostColView({collection:postings});
  
  Backbone.history.start();
  
  app.postings = postings

});