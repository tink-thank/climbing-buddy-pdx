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
   // 'keydown .posting-reply':'addReplyEnter',
    'click .posting-reply-button': 'addReply',
    // 'click .posting-reply': 'edit',
    // 'blur .posting-reply':'removeOrange'
  },
  
  edit: function () {
    this.$el.addClass('orange');
  },
  
  removeOrange: function () {
    this.$el.removeClass('orange');
  },

  addReply: function () {
    // this.$el.addClass('orange');    
    var self = this;
    var replyMessage = this.$el.find('.posting-reply').val();

    if (replyMessage) {    
      $.getJSON('/user', function (data) {        
      
        var replyArray = _.clone(self.model.get('replies'));

        replyArray.push({
          userName: data.displayName,
          userImg: data.avatar,
          message: replyMessage,
          time: new Date().toDateString(),
          timeStamp: Date.now()
        });

        self.model.save({ replies: replyArray });

        self.$el.find('.posting-reply').val('');
        // self.$el.removeClass('orange');
        
      });
    } else {
      self.$el.find('.text-danger').html('**VALIDATION FAIL**').fadeOut(0).fadeIn(250).fadeOut(1000);
    }
  },  
    
  // addReplyEnter: function (e) {
		// if (e.which === ENTER_KEY) {
		// 	this.addReply(); 
		// }   
  // }
  
  
});

module.exports = PostingView;