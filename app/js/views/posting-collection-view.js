var postingsViewTemplate = require('../../templates/postingcoll.handlebars');
var PostingView = require('./posting-view');
var Posting = require('../models/posting.js');

var PostingCollectionView = Thorax.CollectionView.extend({
  // template: Handlebars.complie('{{collection}}'),
  // itemView: PostingView,
  name: 'postingcoll',
  el: '#main',
  
  initialize: function () {
    var collection = this.collections;
    collection.fetch({reset: true});
    this.render();

    this.listenTo(collection, 'add', this.addOne);
    this.listenTo(collection, 'reset', this.addAll);
  },

  addOne: function (post) {
    var view = new PostingView({ model: post });
    $('#main-postings').append( view.render().el );
  },

  addAll: function () {
    this.$('#main-postings').html('');
    app.Todos.each(this.addOne, this);
  }
  
  
});

module.exports = PostingCollectionView;