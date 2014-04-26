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

  addReply: function (event) {
    
    var self = this;
    
    $.getJSON('/user', function (data) {
    
      var replyArray = _.clone(self.model.get('replies'));

      replyArray.push({
        userName: data.displayName,
        userImg: data.avatar,
        message: $(".posting-reply").val().trim(),
        time: new Date().toDateString(),
        timeStamp: Date.now()
      });

      self.model.save({ replies: replyArray });
      
      console.log(self.model.replies);

      $(".posting-reply").val('');
      
    });
  }
  
  
});

module.exports = PostingView;