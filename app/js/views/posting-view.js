var postingsViewTemplate = require('../../templates/posting.handlebars');
var Reply = require('../models/reply.js');

var PostingView = Thorax.View.extend({
  template: Handlebars.compile('{{collection}}') ,
  name: 'posting-view',
  
  context: function (model, i) {
    return this.model.attributes;
  },
  
  initialize: function () {
    this.render();
    this.listenTo(this.model, 'change', this.render);
  },
  
  events: {
    'click .posting-reply-button': 'addReply'
  },

  addReply: function () {
    $.getJSON('/user', function(data) {
    
      var replyArray = this.model.get('replies');

      replyArray.push({
        userName: data.displayName,
        userImg: data.avatar,
        message: $(".posting-reply").val().trim()
      });

      this.model.save({ replies: replyArray });
      
      console.log(this.model.replies);

      $(".posting-reply").val('');
      
    });
  }
  
  
});

module.exports = PostingView;