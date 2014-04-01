$(function () {
  var derp = require('./views/testview.js')

  var view = new Thorax.View({
    greeting: "Hello",
    template: Handlebars.compile("{{greeting}} world!")
  });
  view.appendTo('#sidebar');
  
  derp();  
  
})