var postingsViewTemplate = require('../../templates/posting.handlebars');

var PostingView = Thorax.View.extend({
  template: postingsViewTemplate,
  //name: 'posting',
  el: '#main',

  initialize: function () {
    this.render();
  },

  events: {
    'click #posting-reply-button': function () {      
      var reply = $("#posting-reply");
      reply.val() ? console.log(reply.val()) : null;
      
      //update this model with a new reply hash, grab var value, user name, Date(), and user portrait
      
      $("#posting-reply").val('');
    }
  }

});

module.exports = PostingView;