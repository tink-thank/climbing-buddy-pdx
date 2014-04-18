var Postings = require('./collections/postings.js');
var FormView = require('./views/form-view.js');
var PostingView = require('./views/posting-view.js');

$(function () {   
  var app = {}
  window.app = app;
  
  var postings = new Postings();
  var postingView = new PostingView({collection:postings});
  var formView = new FormView({collection:postings});     
  
  Backbone.history.start();
  
//  $.get('data.json', function (data) {
//    postings.add(data)    
//  })
  
  app.postings = postings
    

});