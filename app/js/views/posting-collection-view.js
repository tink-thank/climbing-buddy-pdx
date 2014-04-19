var PostingView = require('./views/posting-view.js');

var PostingCollectionView = Thorax.View.extend({
  
  render: function() {
    this.collection.forEach(function (posting) {
      var postingView = new PostingView({model:posting});
    });
  }
});

module.exports = PostingCollectionView;