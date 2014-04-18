var postingsViewTemplate = require('../../templates/posting.handlebars');

var PostingView = Thorax.View.extend({
  template: postingsViewTemplate,
  name: 'posting',
  el: '#main',
  
  initialize: function () {
    this.render();
  },
  
  events: {
    'click #posting-reply-button': function () {
      
      console.log($("#posting-reply").val());
      $("#posting-reply").val('');
    }
  }   

});

module.exports = PostingView;