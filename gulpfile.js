var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var concat = require('gulp-concat');

gulp.task('bundle', function () {
    var bundleStream = browserify('./rx-pagination.js', {debug: true}).bundle();

    bundleStream
        .pipe(source('./rx-pagination.js'))
        .pipe(gulp.dest('./bin'));
});

gulp.task('watch', function () {
    gulp.watch('./rx-pagination.js', ['bundle']);
})
