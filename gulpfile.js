var
  concat = require('gulp-concat'),
  gulp = require('gulp'),
  jasmine = require('gulp-jasmine-phantom'),
  uglify = require('gulp-uglify');

gulp.task('dist', function () {
  var stream = gulp.src('src/*.js')
    .pipe(uglify())
    .pipe(concat('oak-core.min.js'))
    .pipe(gulp.dest('dist/'));
  return stream;
});

gulp.task('test', function () {
  return gulp.src('{src,spec}/core.js')
    .pipe(jasmine({
      integration: true,
      verbose: true
    }));

});

gulp.task('watch', function () {
  var watcher = gulp.watch('{src,spec}/*.js', ['test']);
  return watcher;
});

gulp.task('default', ['test', 'dist', 'docs']);
