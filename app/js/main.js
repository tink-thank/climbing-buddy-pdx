var Posting = require('./models/posting.js');
var Postings = require('./collections/postings.js');
var PostingsView = require('./views/posting-view.js');
var postingsViewTemplate = require('./templates/posting.handlebars');
var helloTemplate = require('./templates/hello-world.handlebars');

$(function () {
  var postingModel = new Posting();
  var postingsCollection = new Postings();
  
  var postingsView = new PostingsView({collection: postingsCollection, template: postingsViewTemplate});
  
var view = new Thorax.View({
  greeting: "Hello",
  template: helloTemplate
});
view.appendTo('body');

  
  
})