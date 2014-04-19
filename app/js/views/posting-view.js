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
      //reply.val() ? console.log(reply.val()) : null;
      
      // this.model.push({replies:{
      //   user: 'Test User Please Ignore',
      //   message: reply,
      //   time: new Date().toDateString(),
      // }});

      // this.model.set({ 
      //   'replies' : this.model.get('replies').concat(reply.val())
      // });

      this.model.attributes.replies.push({
        user: 'Test User Please Ignore',
        message: reply.val(),
        time: new Date().toDateString(),
      });
      
      $("#posting-reply").val('');
    }
  }

});

module.exports = PostingView;