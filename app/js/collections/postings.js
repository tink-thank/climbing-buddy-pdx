var Posting = require('../models/posting.js');

var Postings = Thorax.Collection.extend({
  model: Posting
});

module.exports = new Postings;