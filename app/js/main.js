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

  var ClimbingRouter = Backbone.Router.extend({});

  var myClimbingRouter = new ClimbingRouter;

  Backbone.history.start();

  
  var app = {}
  window.app = app;    

  var postings = new Postings();
  postings.fetch();
  //postings.fetch({reset: true});

  var formView = new FormView({collection:postings});
  var appView = new PostColView({collection:postings});
  

  
  
  
  app.postings = postings;

});