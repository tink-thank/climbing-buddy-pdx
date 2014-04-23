var postingsViewTemplate = require('../../templates/posting.handlebars');

var PostingView = Thorax.View.extend({
  template: Handlebars.compile('{{collection}}') ,
  name: 'posting-view',
  context: function (model, i) {
    return this.model.attributes;
  },
  
  initialize: function () {
    this.render();
  },
  
  events: {
  'click #posting-reply-button': function () {      
    var reply = $("#posting-reply");
    console.log(reply.val());

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
  }
  
  
});

module.exports = PostingView;