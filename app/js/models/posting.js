var Posting = Thorax.Model.extend({
  defaults:{
    'user':'Alex Honnold',
    'climb-gym':'circuit-ne',
    'climb-eta':'30',
    'climb-duration':'60',
    'climb-details':'Sending V-10\'s like what',
    'replies':[
      {'user':'Chris Sharma','message':'I will see you there in 15','time':' Wed, 1:00 PM'},
      {'user':'Sasha Digulian','message':'Sprained my ankle, no climbing for me','time':' Wed, 4:35 PM'}
    ]
  }
  
});

module.exports = Posting;