var Posting = Thorax.Model.extend({
  defaults:{
    'user':'Rogue Climber 420 Hero',
    'climb-gym':'circuit-ne',
    'climb-eta':'30',
    'climb-duration':'60',
    'climb-details':'Sending V-10\'s like what',
    'replies':[
      {'user':'Chris Sharma','message':'I will see you there in 15','time':'time here'},
      {'user':'Sasha Digulian','message':'Tore a pulley, no climbing for me','time':'time here also'}
    ]
  }
});

module.exports = Posting;