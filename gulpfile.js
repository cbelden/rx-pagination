var gulp = require('gulp');
var browserify = require('browserify');
var hbsfy = require('hbsfy').configure({
    extensions: ['handlebars']
});
var source = require('vinyl-source-stream');
var concat = require('gulp-concat');

gulp.task('bundle', function () {
    var bundleStream = browserify('./rx-pagination.js', {debug: true})
        .transform(hbsfy)
        .bundle();

    bundleStream
        .pipe(source('./rx-pagination.js'))
        .pipe(gulp.dest('./bin'));
});

gulp.task('watch', function () {
    gulp.watch('./rx-pagination.js', ['bundle']);
    gulp.watch('./templates/*.handlebars', ['bundle']);
})
