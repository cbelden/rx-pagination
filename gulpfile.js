var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

gulp.task('bundle', function () {
    var bundleStream = browserify('./rx-pagination.js').bundle();

    bundleStream
        .pipe(source('./rx-pagination.js'))
        .pipe(gulp.dest('./bin'));
});
