var Postings = require('./collections/postings.js');
var FormView = require('./views/form-view.js');
var PostColView = require('./views/posting-collection-view.js');
var data = '';

$(function () {
  
//  $.getJSON('/posts', function (jsonData) {
//    data = jsonData;
//    console.log(data)
//  })
//  
  
  Backbone.sync = function (method, model) {
    console.log(method, model);
  };
  
  var app = {}
  window.app = app;    

  var postings = new Postings();
  postings.fetch();
  //postings.fetch({reset: true});

  var formView = new FormView({collection:postings});
  var appView = new PostColView({collection:postings});
  

  
  Backbone.history.start();
  
  app.postings = postings;

});