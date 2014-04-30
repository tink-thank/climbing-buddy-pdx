var Postings = require('./collections/postings.js');
var FormView = require('./views/form-view.js');
var PostColView = require('./views/posting-collection-view.js');
var TopBar = require('./models/topbar.js')
var TopBarView = require('./views/topbar-view.js');
var AboutView = require('./views/about-view.js');

$(function () {

  var ClimbingRouter = Backbone.Router.extend({});

  var myClimbingRouter = new ClimbingRouter;
  Backbone.history.start();

  var postings = new Postings();
  postings.fetch();

  var formView = new FormView({
    collection: postings
  });
  var appView = new PostColView({
    collection: postings
  });

  var topBar = new TopBar()
  var topBarView = new TopBarView({
    model: topBar
  });
  
  var aboutView = new AboutView({model: new Thorax.Model() });

  myClimbingRouter.route("circuit-ne", "showNE", function () {
    $('#about').addClass('hidden');
    $('#main').show();
    appView.collection.forEach(function (model) {
      if (model.get('climbGym') === 'Circuit NE') {
        var id = model.cid;
        $('div[data-model-cid=' + id + ']').show();
      } else {
        var id = model.cid;
        $('div[data-model-cid=' + id + ']').hide();
      }
    })
  });

  myClimbingRouter.route("circuit-sw", "showSW", function () {
    $('#about').addClass('hidden');
    $('#main').show();
    appView.collection.forEach(function (model) {
      if (model.get('climbGym') === 'Circuit SW') {
        var id = model.cid;
        $('div[data-model-cid=' + id + ']').show();
      } else {
        var id = model.cid;
        $('div[data-model-cid=' + id + ']').hide();
      }
    })
  });

  myClimbingRouter.route("prg", "showPRG", function () {
    $('#about').addClass('hidden');
    $('#main').show();
    appView.collection.forEach(function (model) {
      if (model.get('climbGym') === 'Portland Rock Gym') {
        var id = model.cid;
        $('div[data-model-cid=' + id + ']').show();
      } else {
        var id = model.cid;
        $('div[data-model-cid=' + id + ']').hide();
      }
    })
  });

  myClimbingRouter.route("", "showALL", function () {
    $('#about').addClass('hidden');
    $('#main').show();
    appView.collection.forEach(function (model) {
      var id = model.cid;
      $('div[data-model-cid=' + id + ']').show();
    })
  });

  myClimbingRouter.route("about", "showABOUT", function () {
    $('#about').removeClass('hidden');
    $('#main').hide();
  });


  var app = {}
  window.app = app;
  app.postings = postings;

});