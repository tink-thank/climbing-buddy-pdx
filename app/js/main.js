// Development only:
Backbone.LocalStorage = require('backbone.localstorage');
// Models
var Posting = require('./models/posting.js');

// Collections
//var Postings = require('./collections/postings.js');

// Views
var PostingView = require('./views/posting-view.js');
var FormView = require('./views/form-view.js');

// View Collections

//Templates
var postingsViewTemplate = require('../templates/posting.handlebars');
var formViewTemplate = require('../templates/form.handlebars');






$(function () {
  var postingModel = new Posting();
  var postingView = new PostingView({model: postingModel, template: postingsViewTemplate});
  var formView = new FormView({template: formViewTemplate});
  
  Backbone.history.start();
  
});