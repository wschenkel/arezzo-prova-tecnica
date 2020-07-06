var gulp = require('gulp'),
	  concat = require('gulp-concat'),
	  uglify = require('gulp-uglify'),
	  cleanCSS = require('gulp-clean-css'),
	  sourcemaps = require('gulp-sourcemaps'),
		assemble = require('fabricator-assemble'),
		del = require('del'),
		spritesmith = require('gulp.spritesmith'),
		imagemin = require('gulp-imagemin'),
  	browserSync = require('browser-sync'),
  	reload = browserSync.reload,
		autoprefixer = require('gulp-autoprefixer'),
		plumber = require('gulp-plumber'),
		gulpUtil = require('gulp-util'),
		config = require('./config.json'),
		sass = require('gulp-sass'),
		sassLint = require('gulp-sass-lint'),
		browserify = require('browserify'),
		source = require('vinyl-source-stream'),
		buffer = require('vinyl-buffer'),
		babelify = require('babelify');

gulp.task('clean', function () {
	return del([config.dest]);
});

gulp.task('assemble', function (done) {
	assemble({
		layout: 'default',
    layouts: config.src + config.layouts,
    layoutIncludes: config.src + config.layoutsIncludes,
    views: [config.src + config.pages, '!' + config.src + config.ignoreLayouts],
    materials: config.src + config.components,
    data: [config.src + 'materials/**/**/**/*.{json,yml}', config.src + 'pages/**/**/*.{json,yml}'],
    docs: config.src + config.docs,
    keys: {
        materials: 'materials',
        views: 'pages',
        docs: 'docs'
    },
    helpers:{
    	compare: function(lvalue, rvalue, options) {

		    if (arguments.length < 3)
		        throw new Error("Handlerbars Helper 'compare' needs 2 parameters");

		    var operator = options.hash.operator || "==";

		    var operators = {
		        '%':       function(l,r) { return l % r; },
		        '==':       function(l,r) { return l == r; },
		        '===':      function(l,r) { return l === r; },
		        '!=':       function(l,r) { return l != r; },
		        '<':        function(l,r) { return l < r; },
		        '>':        function(l,r) { return l > r; },
		        '<=':       function(l,r) { return l <= r; },
		        '>=':       function(l,r) { return l >= r; },
		        'typeof':   function(l,r) { return typeof l == r; }
		    }

		    if (!operators[operator])
		        throw new Error("Handlerbars Helper 'compare' doesn't know the operator "+operator);

		    var result = operators[operator](lvalue,rvalue);

		    if( result ) {
		        return options.fn(this);
		    } else {
		        return options.inverse(this);
		    }
			},
			json: function(context) {
				return JSON.stringify(context);
			}
    },
		onError: function(error) { console.log(error); done(); },

    dest: config.dest});

	done();
});

gulp.task('sass', function () {
	return gulp.src([config.styles, config.componentsStyles, config.pagesStyles])
	.pipe(plumber())
	.pipe(sassLint())
	.pipe(sassLint.format())
	.pipe(sassLint.failOnError())
	.pipe(sourcemaps.init())
	.pipe(sass({includePaths: ['node_modules', 'src/sass']}).on('error', sass.logError))
	.pipe(autoprefixer('last 2 versions'))
  .pipe(concat('style.min.css'))
  .pipe(gulp.dest(config.dest + '/assets/css'))
  .pipe(gulp.dest(config.destDev + '/css'))
  .pipe(browserSync.stream({match: "**/*.css"}));
});

gulp.task('scripts', function () {
	return browserify(config.scripts)
	.transform('babelify', { "presets": ["@babel/preset-env"] })
	.bundle()
	.pipe(source('app.min.js'))
	.pipe(buffer())
	.pipe(plumber())
	.pipe(gulp.dest(config.dest + '/assets/js'))
	.pipe(gulp.dest(config.destDev + '/js'));

});

gulp.task('scripts-build', function () {
	return browserify(config.scripts)
	.transform('babelify', { "presets": ["@babel/preset-env"] })
	.bundle()
	.pipe(source('app.min.js'))
	.pipe(buffer())
	.pipe(plumber())
	.pipe(uglify().on('error', gulpUtil.log))
	.pipe(gulp.dest(config.dest + '/assets/js'))
	.pipe(gulp.dest(config.destDev + '/js'));
});

gulp.task('sass-build', function () {
  return gulp.src([config.styles, config.componentsStyles, config.pagesStyles])
  .pipe(plumber())
  .pipe(sourcemaps.init())
  .pipe(sass({includePaths: ['node_modules', 'src/sass']}).on('error', sass.logError))
	.pipe(autoprefixer('last 2 versions'))
  .pipe(concat('style.min.css'))
  .pipe(cleanCSS({keepBreaks:false, compatibility: 'ie8'}))
  .pipe(sourcemaps.write('../sourcemaps'))
  .pipe(gulp.dest(config.dest + '/assets/css'))
  .pipe(gulp.dest(config.destDev + '/css'))
  .pipe(browserSync.stream({match: "**/*.css"}));
});

gulp.task('fonts', function() {
 return gulp.src(config.fonts)
  .pipe(gulp.dest(config.dest + '/assets/fonts'))
  .pipe(gulp.dest(config.destDev + '/fonts'));
});

gulp.task('imgs', function() {
  return gulp.src([config.images, '!' + config.sprites])
  .pipe(plumber())
  .pipe(gulp.dest(config.dest + '/assets/img'))
  .pipe(gulp.dest(config.destDev + '/img'));
});

gulp.task('imgs-build', function() {
  return gulp.src([config.images, '!' + config.sprites])
  .pipe(plumber())
  .pipe(imagemin({ optimizationLevel: 7, progressive: true, interlaced: true }))
  .pipe(gulp.dest(config.dest + '/assets/img'))
  .pipe(gulp.dest(config.destDev + '/img'));
});

gulp.task('sprite', function () {
  return gulp.src(config.sprites)
  .pipe(plumber())
  .pipe(spritesmith({
    imgName: '../img/sprite.png',
    imgPath: '../img/sprite.png',
    cssName: 'sprite.scss',
    cssFormat: 'css'/*,
    retinaSrcFilter: config.sprites2x,
    retinaImgName: '../img/sprite-2x.png'*/
  }))
  .pipe(gulp.dest(config.spriteDest));
});

gulp.task('copy-jsons', function() {
  return gulp.src(config.jsons)
      .pipe(gulp.dest(config.dest + '/assets/json'))
      .pipe(gulp.dest(config.destDev + '/json'));
});

gulp.task('reloading', function(done) {
	reload();
	done();
});

// server
gulp.task('serve', function () {

	browserSync({
		server: {
			baseDir: config.dest,
			directory: true
		},
		notify: true,
		logPrefix: 'Frontend Starter kit'
	});

	gulp.watch(config.assemble, gulp.series('assemble', 'reloading'));
	gulp.watch([config.styles, config.componentsStyles, config.pagesStyles], gulp.series('sass'));
	gulp.watch([config.scripts, config.componentsScripts, config.pagesScripts], gulp.series('scripts', 'reloading'));
	gulp.watch(config.images, gulp.series('imgs', 'reloading'));
	gulp.watch(config.sprites, gulp.series('sprite'));
	gulp.watch(config.fonts, gulp.series('fonts', 'reloading'));
	gulp.watch(config.jsons, gulp.series('copy-jsons', 'reloading'));

});

// default build task
gulp.task('default', gulp.series(
	'clean',
	'assemble',
	'scripts',
	'fonts',
	'sprite',
	'sass',
	'imgs',
	'copy-jsons',
	'serve'
));

gulp.task('build', gulp.series(
	'assemble',
	'scripts-build',
	'fonts',
	'sprite',
	'sass-build',
	'imgs-build',
	'copy-jsons',
	'serve'
));
