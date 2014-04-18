var posting = require('../models/posting.js');

var Postings = Thorax.Collection.extend({
  model: posting
});

module.exports = Postings;