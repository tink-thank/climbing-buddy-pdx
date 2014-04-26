var formViewTemplate = require('../../templates/form.handlebars');

var FormView = Thorax.View.extend({
  template: formViewTemplate,
  name: 'Form View',
  el: '#sidebar',
  
  userData: {},
  
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
      details: $('#climb-details').val().trim(),
    };
    
    var postingId = this.postingIdMaker();
    var self = this;    
      
    self.collection.create({
      postingId: postingId,
      title: 'posting-' + postingId,
      timeStamp: Date.now(),
      userName: this.userData.displayName,
      userImg: this.userData.avatar,
      climbGym: clmb.gym,
      climbEta: clmb.eta,
      climbDuration: clmb.duration,
      climbDetails: clmb.details,
      replies: [],
      id: postingId,
    });
    
      $('#climb-gym').val('');
      $('#climb-eta').val('');
      $('#climb-duration').val('');
      $('#climb-details').val('');
      $('.row-offcanvas').toggleClass('active');
  },
});

module.exports = FormView;