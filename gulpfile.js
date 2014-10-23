var
  concat = require('gulp-concat'),
  gulp = require('gulp'),
  jasmine = require('gulp-jasmine-phantom'),
  uglify = require('gulp-uglify');

var srcFiles = [
  'src/polyfills.js',
  'src/oak.js',
  'src/raf.js'
];
var specFiles= [
  'spec/oak.js'
];

gulp.task('dist', function () {
  var stream = gulp.src(srcFiles)
    .pipe(uglify())
    .pipe(concat('oak.min.js'))
    .pipe(gulp.dest('dist/'));

  var stream = gulp.src(srcFiles)
    .pipe(concat('oak.js'))
    .pipe(gulp.dest('dist/'));
  return stream;
});

gulp.task('spec', function () {
  return gulp.src(srcFiles.concat(specFiles))
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
