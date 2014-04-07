var formViewTemplate = require('../../templates/form.handlebars');

var FormView = Thorax.View.extend({
  name:'form-view',
  
  el:'#sidebar',
  
  initialize: function () {
    this.render();
  },
  
  template: formViewTemplate
  
});

module.exports = FormView;