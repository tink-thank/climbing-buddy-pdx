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
    var climbing = {
      gym: $("#sidebar").find('#climb-gym'),
      eta: $("#sidebar").find('#climb-eta'),
      length: $("#sidebar").find('#climb-length'),
      details: $("#sidebar").find('#climb-details'),
    };

    this.collection.add({
      'user': 'Default User, please replace', //Update with log-in auth stuffs
      'user-img': 'test.jpg', //update with log-in auth stuffs
      'climb-gym': climbing.gym.val(),
      'climb-eta': climbing.eta.val(),
      'climb-duration': climbing.length.val(),
      'climb-details': climbing.details.val(),
      'replies': false
    });

    console.log(climbing.gym.val(), climbing.eta.val(), climbing.length.val(), climbing.details.val());

    climbing.gym.val('');
    climbing.eta.val('');
    climbing.length.val('');
    climbing.details.val('');    

    $('.row-offcanvas').toggleClass('active');

  },
  


});

module.exports = FormView;