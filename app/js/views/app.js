var PostingView = require('./posting-view.js');

var AppView = Thorax.View.extend({
  
  el:'#main',
  
  initialize: function () {
    this.childViews = [];
    this.listenTo(this.collection, 'add', this.render);
    this.$postList = this.$el.find('#main');
    this.render();
    
  },
  
  events: {
      'click #form-submit-button': 'addNewPosting'
  },
  
  addNewPosting: function () {
    
    var $postingUserIn = 'Default User, please replace'
    var $postingGymIn = this.$el.find('#climb-gym').val();
    var $postingEtaIn = this.$el.find('#climb-eta').val();
    var $postingLengthIn = this.$el.find('#climb-length').val();
    var $postingDetailsIn = this.$el.find('#climb-details').val();

    this.collection.add({
      'user':$postingUserIn,
      'climb-gym':$postingGymIn,
      'climb-eta':$postingEtaIn,
      'climb-duration':$postingLengthIn,
      'climb-details':$postingDetailsIn,
      'replies':null
    });

    this.$el.find('input').val('');    
    
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