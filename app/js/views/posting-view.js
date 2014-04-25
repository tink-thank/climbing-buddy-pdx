var postingsViewTemplate = require('../../templates/posting.handlebars');

var PostingView = Thorax.View.extend({
  template: Handlebars.compile('{{model}}') ,
  // name: 'posting-view',
  tagName: 'div',
  
  initialize: function () {
    this.listenTo(this.model, 'change', this.render);
  },

  render: function () {
    this.$el.html(template);
    return this;
  },
  
  events: {
  'click #posting-reply-button': 'addReply'
  },

  addReply: function () {      
    var value = $("#posting-reply").val();
    console.log(reply);
    var replyArray = this.model.get('replies');
    console.log(replyArray);
    // console.log(this.model);
    replyArray.push(reply);
    
    this.model.set('replies', replyArray);
    this.model.save(replies);

//      if (reply.val()) {        
//        //This needs fixing. Obviously.
//        this.model.attributes.replies.push({
//          user: 'Test User Please Ignore',
//          message: reply.val(),
//          time: new Date().toDateString(),
//        });
//        reply.val('');
//      }
    }
  
  
});

module.exports = PostingView;