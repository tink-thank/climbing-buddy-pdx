var formViewTemplate = require('../../templates/form.handlebars');

var FormView = Thorax.View.extend({
  name:'form-view',
events: {
    "submit form": function(event) {
      event.preventDefault();
      this.collection.add(this.serialize());
      return this.$('input[select="climb-gym"]').val('');
    }
  },
  el:'#sidebar',
//  render: function () {    
//  },
  initialize: function () {
    this.render();
  },
  
  template: formViewTemplate
  
  
  
  
  
});

module.exports = FormView;