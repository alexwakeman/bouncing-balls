var gulp = require('gulp');
var path = require('path');
var sourcemaps = require('gulp-sourcemaps');
var ts = require('gulp-typescript');
var sass = require('gulp-sass');
var connect = require('gulp-connect');
var concat = require('gulp-concat');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var tsify = require('tsify');
var karma = require('karma');

gulp.task('connect', function() {
    connect.server({
        root: 'dist',
        livereload: true
    });
});

gulp.task('app', function () {
	return browserify({
		basedir: '.',
		debug: true,
		entries: ['src/ts/bootstrap.ts'],
		cache: {},
		packageCache: {}
	})
	.plugin(tsify)
	.bundle()
	.pipe(source('app.js'))
	.pipe(gulp.dest('dist/js'));
});

gulp.task('sass', function() {
	return gulp.src('src/scss/*.scss')
		.pipe(sass())
		.pipe(gulp.dest('dist/css'));
});

gulp.task('build', ['app', 'sass']);

gulp.task('serve', ['build', 'connect']);

gulp.task('watch', ['build', 'connect'], function() {
	gulp.watch('src/scss/*.scss', ['sass']);
	gulp.watch('src/**/*.ts', ['app']);
});

gulp.task('test', function(done) {
	var server = new karma.Server({
		configFile: __dirname + '/karma.conf.js',
		singleRun: true
	}, function() {
		done();
	});
	server.start();
});
