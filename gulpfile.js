var
  concat = require('gulp-concat'),
  gulp = require('gulp'),
  jasmine = require('gulp-jasmine-phantom'),
  uglify = require('gulp-uglify');

gulp.task('dist', function () {
  var stream = gulp.src('src/*.js')
    .pipe(uglify())
    .pipe(concat('oak.min.js'))
    .pipe(gulp.dest('dist/'));

  var stream = gulp.src('src/*.js')
    .pipe(concat('oak.js'))
    .pipe(gulp.dest('dist/'));
  return stream;
});

gulp.task('spec', function () {
  return gulp.src('{src,spec}/oak.js')
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
