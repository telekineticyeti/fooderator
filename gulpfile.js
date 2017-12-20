var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');

var sass_options = {
	outputStyle: 'nested',
	includePaths: [
		require('node-bourbon').includePaths
	]
}
gulp.task('sass', function () {
	return gulp
		.src('./sass/**/*.s*ss')
		.pipe(sass(sass_options).on("error", sass.logError))
		.pipe(gulp.dest('./src/css'));
});

gulp.task('autoprefix', () =>
	gulp.src('src/**/*.css')
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(gulp.dest('public'))
);

gulp.task('watch', function() {
	gulp.watch('sass/**/*.s*ss', ['sass']);
	gulp.watch('src/**/*.css', ['autoprefix']);
});

gulp.task('default', ['watch']);
