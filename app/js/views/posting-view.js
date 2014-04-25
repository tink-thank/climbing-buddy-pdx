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
    var replyArray = this.model.get('replies');
    
    replyArray.push({
      displayName: 'Test User',
      avatar: 'http://lorempixel.com/75/75',
      message: $(".posting-reply").val()
    });
    console.log(replyArray);
    this.model.save({ replies: replyArray });
    
    $(".posting-reply").val('');    
  }
  
  
});

module.exports = PostingView;