var formViewTemplate = require('../../templates/form.handlebars');

var FormView = Thorax.View.extend({
  template: formViewTemplate,
  name: 'Form View',
  el: '#sidebar',
  
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
  
  dateFormatter: function (timeIn) {
    var longDate = new Date(timeIn);
    return (longDate.toDateString() + " " + longDate.toLocaleTimeString("en-US"));
  },

  newPosting: function () {
    var self = this;   
    
    $.getJSON('/user', function (data) {
      var clmb = {
        gym: $('#climb-gym').val(),
        eta: $('#climb-eta').val(),
        duration: $('#climb-duration').val(),
        details: $('#climb-details').val().trim(),
      };

      var postingId = self.postingIdMaker();
      
      if (clmb.gym != 'null' && clmb.eta != 'null' && clmb.duration != 'null') {
        self.collection.create({
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
          formattedDate: self.dateFormatter( Date.now() )
        });
        
        $('#climb-gym').val('');
        $('#climb-eta').val('');
        $('#climb-duration').val('');
        $('#climb-details').val('');
        $("#wrapper").toggleClass("active");

      } else {
        self.$el.find('.text-danger').html('**VALIDATION FAIL**').fadeOut(0).fadeIn(250).fadeOut(1000);
      }


    });
  },
});

module.exports = FormView;

//      var timeString = this.model.get('timeStamp');
//      var longDate = new Date(timeString);
//      var formattedDate = longDate.toDateString() + " " + longDate.toLocaleTimeString("en-US");