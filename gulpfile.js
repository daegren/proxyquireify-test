var browserify   = require('browserify');
var watchify     = require('watchify');
var gulp         = require('gulp');
var source       = require('vinyl-source-stream');
var glob         = require('glob');
var proxyquire   = require('proxyquireify');

gulp.task('specs', function() {
  var bundler = browserify({
    // Required watchify args
    cache: {}, packageCache: {}, fullPaths: true,
    // Specify the entry point of your app
    entries: './tests/foo_spec.js',
    paths: [
      './node_modules',
      './js'
    ]
  });

  var bundle = function() {
    return bundler
      .plugin(proxyquire.plugin)
      .bundle()
      // Use vinyl-source-stream to make the
      // stream gulp compatible. Specifiy the
      // desired output filename here.
      .pipe(source('specs.js'))
      // Specify the output destination
      .pipe(gulp.dest('./'));
  };

  bundler = watchify(bundler);
    // Rebundle with watchify on changes.
  bundler.on('update', bundle);

  return bundle();
});

gulp.task('default', ['specs']);
