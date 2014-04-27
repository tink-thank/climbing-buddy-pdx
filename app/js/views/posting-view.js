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
//    'keydown .posting-reply':'addReplyEnter',
    'click .posting-reply-button': 'addReply',
    'click .posting-reply': 'edit',
    'blur .posting-reply':'removeOrange',
    'click .btn-danger':'removeModelYo'
  },
  
  checkUser: function () {
    
  },
  
  removeModelYo: function () {
    this.model.destroy();
  },
  
  edit: function () {
    this.$el.addClass('orange');
  },
  
  removeOrange: function () {
    this.$el.removeClass('orange');
  },

  addReply: function () {
    
    var self = this;
    
    $.getJSON('/user', function (data) {
      self.$el.addClass('orange');
    
      var replyArray = _.clone(self.model.get('replies'));

      replyArray.push({
        userName: data.displayName,
        userImg: data.avatar,
        message: $(".orange").find(".posting-reply").val(),
        time: new Date().toDateString(),
        timeStamp: Date.now()
      });

      self.model.save({ replies: replyArray });

      self.$el.find('.posting-reply').val('');
      self.$el.removeClass('orange');
      
    });
  },
  
//  addReplyEnter: function (e) {
//			if (e.which === ENTER_KEY) {
//				this.addReply(); 
//			}    
//  }
  
  
});

module.exports = PostingView;