var gulp = require('gulp');
var browserify = require('browserify');
var hbsfy = require('hbsfy').configure({
    extensions: ['handlebars']
});
var source = require('vinyl-source-stream');
var concat = require('gulp-concat');

gulp.task('bundle', function () {
    var bundleStream = browserify('./index.js', {debug: true})
        .transform(hbsfy)
        .bundle();

    bundleStream
        .pipe(source('./index.js'))
        .pipe(gulp.dest('./bin'));
});

gulp.task('watch', function () {
    gulp.watch('./index.js', ['bundle']);
    gulp.watch('./templates/*.handlebars', ['bundle']);
})
