var Posting = require('./models/posting.js');
var Postings = require('./collections/postings.js');
var FormView = require('./views/form-view.js');
var PostingView = require('./views/posting-view.js');

$(function () {  
  var postings = new Postings({model:Posting});
  var postingView = new PostingView({collection:postings})
  var formView = new FormView({collection:postings});
  Backbone.history.start();
});