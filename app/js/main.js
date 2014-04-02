var Posting = require('./models/posting.js');
//var Postings = require('./collections/postings.js');
var PostingView = require('./views/posting-view.js');
var postingsViewTemplate = require('./templates/posting.handlebars');

$(function () {
  var postingModel = new Posting();
  var postingView = new PostingView({model: postingModel, template: postingsViewTemplate});
  //var postingsCollection = new Postings();
  
  //var postingsView = new PostingsView({collection: postingsCollection, template: postingsViewTemplate});

  
  
})