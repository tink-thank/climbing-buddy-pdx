var formViewTemplate = require('../../templates/form.handlebars');

var FormView = Thorax.View.extend({
  template: formViewTemplate,
  name: 'Form View',
  el: '#sidebar',
  count: 10001,
  
  events: {
    'click #posting-submit-button': 'newPosting'
  },

  initialize: function () {
    this.render();
  },
  
  postingIdMaker: function () {
    return Math.floor( Math.random() * 1000000000 );
  },

  newPosting: function () {
    var user = {};
    
    $.getJSON('/user', function (data) {
      user = data;
      console.log(user, user.displayName);
    });
    
    var postingId = this.postingIdMaker();
    
    var clmb = {
      gym: $('#climb-gym'),
      eta: $('#climb-eta'),
      duration: $('#climb-duration'),
      details: $('#climb-details'),
    };

    this.collection.add({
      postingId: postingId,
      title: 'posting-' + postingId,
      timeStamp: Date.now(),
      userName: user.displayName,
      userImg: user.avatar,
      climbGym: clmb.gym.val(),
      climbEta: clmb.eta.val(),
      climbDuration: clmb.duration.val(),
      climbDetails: clmb.details.val(),
      replies: false,
      id: postingId,
    });

    clmb.gym.val('');
    clmb.eta.val('');
    clmb.duration.val('');
    clmb.details.val('');    

    $('.row-offcanvas').toggleClass('active');

  },
  


});

module.exports = FormView;