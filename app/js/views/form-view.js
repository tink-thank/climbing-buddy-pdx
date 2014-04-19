var formViewTemplate = require('../../templates/form.handlebars');

var FormView = Thorax.View.extend({
  template: formViewTemplate,
  name: 'form-view',
  el: '#sidebar',
  events: {
    'click #posting-submit-button': 'newPosting'
  },

  initialize: function () {
    this.render();
  },

  newPosting: function () {
    var clmb = {
      gym: $('#climb-gym'),
      eta: $('#climb-eta'),
      duration: $('#climb-duration'),
      details: $('#climb-details'),
    };

    this.collection.add({
      user: 'Default User, please replace', //Update with log-in auth stuffs
      userImg: 'test.jpg', //update with log-in auth stuffs
      climbGym: clmb.gym.val(),
      climbEta: clmb.eta.val(),
      climbDuration: clmb.duration.val(),
      climbDetails: clmb.details.val(),
      replies: false
    });

    console.log(clmb.gym.val(), clmb.eta.val(), clmb.duration.val(), clmb.details.val());

    clmb.gym.val('');
    clmb.eta.val('');
    clmb.duration.val('');
    clmb.details.val('');    

    $('.row-offcanvas').toggleClass('active');

  },
  


});

module.exports = FormView;