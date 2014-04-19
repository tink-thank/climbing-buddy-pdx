var postingsViewTemplate = require('../../templates/posting.handlebars');

var PostingView = Thorax.View.extend({
  template: postingsViewTemplate,
  name: 'Posting View',
  el: '#main',

  initialize: function () {
    this.render();
  },

  events: {
    'click #posting-reply-button': function () {      
      var reply = $("#posting-reply");

      if (reply.val()) {
        
        //This needs fixing. Obviously.
        this.model.attributes.replies.push({
          user: 'Test User Please Ignore',
          message: reply.val(),
          time: new Date().toDateString(),
        });

        reply.val('');
      }
    }
  }

});

module.exports = PostingView;