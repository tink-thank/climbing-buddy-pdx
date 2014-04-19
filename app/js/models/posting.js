var Posting = Thorax.Model.extend({
  name:'Posting Model',
  
  defaults: {
    user: 'Alex Honnold',
    userImg: 'kitten.jpg',
    climbGym: 'Circuit NE',
    climbEta: '30',
    climbDuration: '60',
    climbDetails: 'Sending V-10\'s like what',
    replies: [
      {
        user: 'Chris Sharma',
        message: 'I will see you there in 15',
        time: ' Wed, 1:00 PM'
      },
      {
        user: 'Sasha Digulian',
        message: 'Tore my pulley, no climbing for me',
        time: ' Wed, 4:35 PM'
      },
      {
        user: 'Chris Sharma',
        message: 'You sent that V-10! Like what!',
        time: ' Wed, 5:40 PM'
      },
    ]
  }

});

module.exports = Posting;