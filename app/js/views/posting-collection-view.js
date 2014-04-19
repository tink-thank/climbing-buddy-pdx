var postingsViewTemplate = require('../../templates/postingcoll.handlebars');

var PostingCollectionView = Thorax.View.extend({
  template: postingsViewTemplate,
  name: 'Postings Collection View',
  el: '#main',
  
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

module.exports = PostingCollectionView;