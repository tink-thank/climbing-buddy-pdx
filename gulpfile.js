//All the lovely requirements
var gulp = require('gulp');
var browserify = require('gulp-browserify');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var browserifyHbs = require('browserify-handlebars');
var nodemon = require('gulp-nodemon');
var colors = require('colors');
var express = require('express');
var app = express();

//For my super-silly timestamp generator.
var timer = require('./times.js');
var start = new Date();

//paths is just for referencing paths relative to this file
var paths = {
  devScript: 'app/js/**/*.*',
  prodScript: 'public_html/js',
  templates: 'app/js/templates',
  scss: 'app/scss/*.scss',
  css: 'public_html/css'
};

//Compiles all the Thorax/Backbone logic into a single file
//via Browserify for our browser. Hence the name. Very clever.
//Also pipes in Handlebar templates.
gulp.task ('scripts', function () {
  gulp.src('app/js/main.js')
    .pipe(browserify ({
      transform: [browserifyHbs]
    }))
    .pipe(gulp.dest('public_html/js'));

  console.log('[' +timer.timeStamp().red.bold+ '] the jerbascript are prepared!'.bold);
  console.log(timer.timeOut(start));

});

//Compiles Sass do we don't have to bother with a separate compiler.
//One of Manning's creations.
gulp.task('sass', function () {
  gulp.src(paths.scss)
    .pipe(sass())
    .pipe(gulp.dest(paths.css));

  console.log('[' +timer.timeStamp().red.bold+ '] mmmm \'dat sass!'.bold);
  console.log(timer.timeOut(start));
});

//Fires up a nodemon service, currently not ignoring files for some reason.
//Every js file edit starts the nodemon server over again, kinda annoying.
//It's a bug and it's on GitHub, hopefully he'll fix it...
gulp.task('express-server', function () {
  nodemon({
      script:'server.js',
      ext: 'js',
      env: { 'NODE_ENV': 'development' },
      ignore: ['app/*', 'public_html/*', 'app/main.js'],
      verbose: true
    })
    .on('restart', function () {
      console.log('[' + 'tink-thank'.green.bold + ']' +' Restarting the server'.bold);
      console.log(timer.timeOut(start));
    })
    .on('crash', function () {
      console.log('[' + 'tink-thank'.green.bold + ']' +' you done borked the server \n\n'.red);
      console.log(timer.timeOut(start));
    });

  console.log('[' + 'tink-thank'.green.bold + ']' +' Welcome to Gulp!'.bold);
});

//Watches js and sass
gulp.task('watch', function () {
  gulp.watch(paths.devScript, ['scripts']);
  gulp.watch(paths.scss, ['sass']);
});

//fires up a static server because...
gulp.task('static-server', function() {
  function static () {
    app.use(express.static(__dirname + '/public_html'));
    app.listen(9000);
    console.log('[' + 'tink-thank'.green.bold + ']' +' Static at Port 9000'.bold);
  }
  static();
});

//gulp express for much win in the command line!
gulp.task('express', ['sass', 'scripts', 'express-server', 'watch']);
gulp.task('static', ['sass', 'scripts', 'static-server', 'watch']);
