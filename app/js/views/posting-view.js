var postingsViewTemplate = require('../../templates/posting.handlebars');

var PostingView = Thorax.View.extend({
  name:'posting',

  el: '#main',
  
  initialize: function () {
    this.render();
  },
  
  //render: function () {},
  template: postingsViewTemplate

});

module.exports = PostingView;