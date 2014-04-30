var templateAbout = require('../../templates/about.handlebars');

var About = Thorax.View.extend({
  template: templateAbout,
  el: '#about',
  initialize: function () {
    this.render();
  }
})

module.exports = About;