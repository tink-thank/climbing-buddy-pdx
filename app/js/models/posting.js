var Posting = Thorax.Model.extend({
  defaults: {
    'user':'Alex Honnold',
    'user-img':'kitten.jpg',
    'climb-gym':'circuit-ne',
    'climb-eta':'30',
    'climb-duration':'60',
    'climb-details':'Sending V-10\'s like what'
  }
  
});

module.exports = Posting;