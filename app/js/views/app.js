var PostingView = require('./posting-view.js');

var AppView = Thorax.View.extend({
  
  el:'#main',
  
  events: {
      'click #posting-submit-button': 'addNewPosting'
  },
  
  initialize: function () {
    this.childViews = [];
    this.listenTo(this.collection, 'add', this.render);
    this.$postList = this.$el.find('#main');
    this.render();    
  },
  
  addNewPosting: function () {    
    console.log("I'm clicked, yo");
    this.collection.add({

      'user': 'Default User, please replace',
      'user-img': 'test.jpg',
      'climb-gym': $("#sidebar").find('#climb-gym').val(),
      'climb-eta': $("#sidebar").find('#climb-eta').val(),
      'climb-duration': $("#sidebar").find('#climb-duration').val(),
      'climb-details': $("#sidebar").find('#climb-details').val(),
      'replies': null      
    });    
  },
  
  render: function () {
    var self = this;
    
    this.childViews = [];
    
    this.childViews.forEach(function (view) {
      view.remove();
    });
    
    this.collection.each(function (everyPost) {
      var postingView = new PostingView({model:everyPost});
      self.$postList.append(postingView.$el);
      self.childViews.push(postingView);
    });
    
    
  }
  
  
  
});

module.exports = AppView;