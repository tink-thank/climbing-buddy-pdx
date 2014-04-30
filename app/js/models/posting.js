var Posting = Thorax.Model.extend({
  name:'Posting Model',
  
  urlRoot: '/posts',
  
  initialize: function () {
    this.save();
  },

  addTime: function () {
    // var timeString = this.get('timeStamp');
    // var longDate = new Date(timeString);
    // var formattedDate = longDate.toDateString() + " " + longDate.toLocaleTimeString("en-US");
    // console.log(formattedDate);
    // this.formattedDate = formattedDate;
    // parseInt(item.value.timeStamp, 10)
  }
  
//  defaults: {
//    postingId: 10000,
//    title: 'default post, please ignore',
//    timeStamp: Date.now(),
//    userName: 'Alex Honnold Default',
//    userImg: 'http://lorempixel.com/75/75',
//    climbGym: 'Circuit NE',
//    climbEta: '30',
//    climbDuration: '60',
//    climbDetails: 'Sending V-10\'s like what',
//    replies: []
//  }

});

module.exports = Posting;