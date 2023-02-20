'use strict';

const gulp = require('gulp');
const rename = require('gulp-rename');
const gulpIf = require('gulp-if');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');

let isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

// сборка HTML страниц
gulp.task('html', function () {
	console.log('---------- сборка HTML страниц');
	const include = require('gulp-file-include');
	return gulp.src('local/source/pages/*.html')
		.pipe(plumber({errorHandler: notify.onError()}))
		.pipe(include({
			prefix: '@@',
			basepath: '@file'
		}))
		.pipe(gulp.dest('local/build'));
});

// сборка HTML блоков для ajax
gulp.task('ajax', function () {
	console.log('---------- сборка HTML блоков для ajax');
	const include = require('gulp-file-include');
	return gulp.src('local/source/ajax/*.html', {base: 'local/source'})
		.pipe(plumber({errorHandler: notify.onError()}))
		.pipe(include({
			prefix: '@@',
			basepath: '@file'
		}))
		.pipe(gulp.dest('local/build'));
});

// сборка PHP
gulp.task('php', function () {
	console.log('---------- сборка PHP, JSON');
	return gulp.src(['local/source/pages/*.php', 'local/source/pages/*.json', 'local/source/pages/*.js'])
		.pipe(gulp.dest('local/build'));
});

// сборка стилевого файла SCSS
gulp.task('style', function () {
	console.log('---------- сборка CSS');
	const scss = require('gulp-sass');
	const autoprefixer = require('autoprefixer');
	const mqpacker = require('css-mqpacker');
	const sortCSSmq = require('sort-css-media-queries');
	const cssnano = require('gulp-cssnano');
	return gulp.src('local/source/scss/style.scss')
		.pipe(plumber({errorHandler: notify.onError()}))
		// .pipe(gulpIf(isDevelopment, sourcemaps.init()))
		.pipe(scss({
			outputStyle: 'expanded'
		}))
		.pipe(postcss([
			autoprefixer(),
			mqpacker({sort: sortCSSmq.desktopFirst})
		]))
		// .pipe(gulpIf(isDevelopment, sourcemaps.write()))
		.pipe(gulp.dest('local/build/css'))
		.pipe(cssnano({zindex: false}))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('local/build/css'))
});

// компиляция ES6 js и копирование скриптов в папку сборки
gulp.task('js', function () {
	console.log('---------- компиляция ES6 js и копирование скриптов в папку сборки');
	const uglify = require('gulp-uglify');
	const concat = require('gulp-concat');
	const babel = require('gulp-babel');
	return gulp.src(['local/source/js/jquery*.js', 'local/source/js/plugins/*.js', 'local/source/js/script.js'],
		{base: 'local/source'})
		.pipe(plumber({errorHandler: notify.onError()}))
		.pipe(babel({ignore: ['local/source/js/jquery*.js', 'local/source/js/plugins/*.js']}))
		.pipe(concat('js/script.js'))
		.pipe(gulp.dest('local/build'))
		.pipe(uglify())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('local/build'));
});

// Отправка в GH pages (ветку gh-pages репозитория)
gulp.task('deploy', function () {
	console.log('---------- Публикация содержимого ./build/ на GH pages');
	const ghPages = require('gulp-gh-pages');
	return gulp.src('./build/**/*', {
		base: 'local/build'
	})
		.pipe(ghPages());
});

// создание спрайта svg
gulp.task('sprite', function () {
	console.log('---------- создание спрайта svg');
	const svgSprite = require('gulp-svg-sprite');
	return gulp.src('local/source/img/icons/*.svg')
		.pipe(imagemin([
			imagemin.svgo({
				plugins: [
					{removeViewBox: true},
					{cleanupIDs: true},
					{inlineStyles: true},
					{removeAttrs: {attrs: ['data-name']}},
					{removeTitle: true},
					{collapseGroups: true}
				]
			})
		]))
		.pipe(svgSprite({
			shape: {
				dimension: {         // Set maximum dimensions
					maxWidth: 500,
					maxHeight: 500
				},
				spacing: {         // Add padding
					padding: 0
				}
			},
			mode: {
				symbol: {
					sprite: '../sprite.svg',
					render: {
						scss: {
							dest: '../../../scss/_sprite.scss',
							template: 'local/source/scss/templates/_sprite_template.scss'
						}
					}
				}
			}
		}))
		.pipe(gulp.dest('local/build/img/sprite'))
});

// запуск слежения за файлами
gulp.task('watch', function () {
	console.log('---------- запуск слежения за изменениями');
	gulp.watch(['local/source/blocks/**/*.scss', 'local/source/scss/**/*.scss'], gulp.series('style'));
	gulp.watch('local/source/blocks/**/*.html', gulp.series('html', 'ajax'));
	gulp.watch('local/source/ajax/**/*.html', gulp.series('ajax'));
	gulp.watch('local/source/pages/**/*.html', gulp.series('html'));
	gulp.watch(['local/source/pages/**/*.json', 'local/source/pages/*.js', 'local/source/pages/*.php'], gulp.series('php'));
	gulp.watch('local/source/js/**/*.js', gulp.series('js'));
	gulp.watch('local/source/img/icons/**/*.svg', gulp.series('sprite'));
});

// запуск сервера
gulp.task('serve', function () {
	console.log('---------- запуск сервера');
	const server = require('browser-sync').create();
	server.init({
		server: './',
		index: './local/build/index.html',
	});
	server.watch('local/build/css/*.css').on('change', server.reload);
	server.watch('local/build/ajax/*.html').on('change', server.reload);
	server.watch('local/build/*.html').on('change', server.reload);
	server.watch('local/build/img/**/*.*').on('change', server.reload);
	server.watch('local/build/js/**/*.js').on('change', server.reload);
	server.watch('local/build/ajax/*.js').on('change', server.reload);
});

// запуск разработки проекта
gulp.task('default',
	gulp.series(
		gulp.parallel('html', 'ajax', 'php', 'style', 'js', 'sprite'),
		gulp.parallel('watch', 'serve')));

// запуск разработки проекта
gulp.task('prod', gulp.parallel('style', 'js'));
