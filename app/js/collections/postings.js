var Posting = require('../models/posting.js');

var Postings = Thorax.Collection.extend({
  name:'Postings Collection',
  model: Posting,
  url: function () {
    return this.document.url() + '/notes';
  }
});

module.exports = Postings;