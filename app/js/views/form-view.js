var formViewTemplate = require('../../templates/form.handlebars');

var FormView = Thorax.View.extend({
  template: formViewTemplate,
  name: 'Form View',
  el: '#sidebar',
  count: 10001,
  
  events: {
    'click #posting-submit-button': 'newPosting',
    'keypress #climb-details': 'createOnEnter'
  },

  initialize: function () {
    this.render();
  },
  
  postingIdMaker: function () {
    return Math.floor( Math.random() * 1000000000 );
  },
  
  createOnEnter: function () {
    
  },

  newPosting: function () {
    var clmb = {
      gym: $('#climb-gym').val(),
      eta: $('#climb-eta').val(),
      duration: $('#climb-duration').val(),
      details: $('#climb-details').val(),
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
        climbGym: clmb.gym,
        climbEta: clmb.eta,
        climbDuration: clmb.duration,
        climbDetails: clmb.details,
        replies: [],
        id: postingId,
      });

    });
    
//    clmb.gym.val('');
//    clmb.eta.val('');
//    clmb.duration.val('');
//    clmb.details.val('');    

    $('.row-offcanvas').toggleClass('active');
  },
});

module.exports = FormView;