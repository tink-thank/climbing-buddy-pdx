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
    var clmb = {
      gym: $('#climb-gym'),
      eta: $('#climb-eta'),
      duration: $('#climb-duration'),
      details: $('#climb-details'),
    };
    
    var postingId = this.postingIdMaker();
    var self = this;
    
    $.getJSON('/user', function (data) {
      
      self.collection.add({
        postingId: postingId,
        title: 'posting-' + postingId,
        timeStamp: Date.now(),
        userName: data.displayName,
        userImg: data.avatar,
        climbGym: this.clmb.gym.val(),
        climbEta: this.clmb.eta.val(),
        climbDuration: this.clmb.duration.val(),
        climbDetails: this.clmb.details.val(),
        replies: false,
        id: postingId,
      });

    });
    
    clmb.gym.val('');
    clmb.eta.val('');
    clmb.duration.val('');
    clmb.details.val('');    

    $('.row-offcanvas').toggleClass('active');
  },
});

module.exports = FormView;