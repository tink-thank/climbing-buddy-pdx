//var template = require('../templates/posting.hbs');

var PostingView = Thorax.View.extend({

  tagName: 'li',

  className: 'list-group-item',

  initialize: function () {
    this.render();
  },

});

module.exports = PostingView;