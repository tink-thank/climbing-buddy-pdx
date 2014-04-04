var Posting = require('../models/posting.js');

var Postings = Thorax.Collection.extend({
  model: Posting,
  localStorage: new Store('postings-thorax')
});

module.exports = new Postings;