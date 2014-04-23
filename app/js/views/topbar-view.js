var topBarTemplate = require('../../templates/topbar.handlebars');

var TopBarView = Thorax.View.extend({
  template: topBarTemplate,
  el: '#top-bar',
  initialize: function () {
    this.render();
  }
});

module.exports = TopBarView;