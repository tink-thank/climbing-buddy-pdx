var gulp = require('gulp');
var browserify = require('gulp-browserify');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var browserifyHbs = require('browserify-handlebars');


var paths = {
  devScript: 'app/js/**/*.*',
  prodScript: 'public_html/js',
  templates: 'app/js/templates',
  scss: 'app/scss/*.scss',
  css: 'public_html/css'  
}

gulp.task ('scripts', function () {
  gulp.src('app/js/main.js')
    .pipe(browserify({
      transform: [browserifyHbs]}) ) //we'll uglify for production but not development.
//    .pipe(uglify() )  
    .pipe(gulp.dest('public_html/js'));
  
  console.log('\nyour jerbascript are prepared!\n');

});

gulp.task('sass', function () {
  gulp.src(paths.scss)
    .pipe(sass())
    .pipe(gulp.dest(paths.css));
  
  console.log('\nmmm \'dat sass\n');
});

gulp.task('watch', function () {
  gulp.watch(paths.devScript, ['scripts']);
  gulp.watch(paths.scss, ['sass']);
});