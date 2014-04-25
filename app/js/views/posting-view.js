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
    'click .posting-reply-button': 'addReply'
  },
  


  addReply: function () {      
    var reply = $(".posting-reply").val();
    var replyArray = this.model.get('replies');
    replyArray.push(reply);
    this.model.save({ replies: replyArray });
    
    $(".posting-reply").val('');
//    console.log(reply);
//    var replyArray = this.model.get('replies');
//    console.log(replyArray);
//    console.log(this.model);
//    replyArray.push(reply);
//    
//    this.model.set('replies', replyArray);
    
    
  }
  
  
});

module.exports = PostingView;