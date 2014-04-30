var Posting = require('../models/posting.js');

var Postings = Thorax.Collection.extend({
  name:'Postings Collection',
  model: Posting,
  url: function () {
    return '/posts' + ( (this.id) ? '/' + this.id : '' );
  },
  comparator: function(model){
        return -model.get("timeStamp");
    }
});

module.exports = Postings;