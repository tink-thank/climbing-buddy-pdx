var Posting = require('./models/posting.js');
var Postings = require('./collections/postings.js');
var FormView = require('./views/form-view.js');
var PostingView = require('./views/posting-view.js');


$(function () {   
  var app = {}
  window.app = app;
  var posting = new Posting();  
  var postings = new Postings({});
  
  var postingView = new PostingView({model:posting});
  var formView = new FormView({collection:postings});
  
  Backbone.history.start();
  app.posting = posting
  app.postings = postings
    

});

