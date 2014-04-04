var PostingView = Thorax.View.extend({
  
  events: {
      'click #form-submit-button': 'addNewPosting'
  },
  
  name:'posting',

  el: '#main',
  
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

  initialize: function () {
    this.render();
  },

});

module.exports = PostingView;