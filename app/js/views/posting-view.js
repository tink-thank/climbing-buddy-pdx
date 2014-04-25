var postingsViewTemplate = require('../../templates/posting.handlebars');

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
  'click #posting-reply-button': 'addReply'
  },

  addReply: function () {      
    var reply = $("#posting-reply").val();
    // console.log(reply);
    var replyArray = this.model.get('replies');
    console.log(replyArray);
    console.log(this.model);
    // replyArray.push(reply);
    
    // this.model.set('replies', replyArray);

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