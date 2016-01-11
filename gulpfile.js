var gulp = require('gulp'),
    postcss = require('gulp-postcss'),
    stylus = require('gulp-stylus'),
    poststylus = require('poststylus'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('autoprefixer'),
    lost = require('lost'),
    jade = require('gulp-jade'),
    nib = require('nib'),
    coffee = require('gulp-coffee'),
    gutil = require('gulp-util'),
    concat = require('gulp-concat'),
    imagemin = require('gulp-imagemin'),
    browserSync = require('browser-sync').create();

var paths = {
  cssSource: 'src/styles/',
  cssDestination: 'public/stylesheets/',
  templatesSource: 'src/',
  templatesDestination: 'public/',
  scriptsSource: 'src/scripts/',
  scriptsDestination: 'public/scripts/',
  imagesSource: 'src/images/',
  imagesDestination: 'public/images/',
  tmp: '.tmp/'
};

gulp.task('default', ['build-all'], function(){
  browserSync.init({
        server: {
            baseDir: "./public"
        }
    });

	// watch for changes inside src folder
  gulp.watch(paths.cssSource + '**/*.styl', ['styles']);
  gulp.watch(paths.templatesSource + '**/*.jade', ['templates']);
  gulp.watch(paths.scriptsSource + '**/*.coffee', ['scripts']);
});

gulp.task('build-all', ['styles', 'templates', 'scripts', 'images']);

gulp.task('scripts', ['scripts:vendor', 'coffee', 'concat']);

gulp.task('images', function() {
  return gulp.src(paths.imagesSource + '*')
    .pipe(imagemin())
    .pipe(gulp.dest(paths.imagesDestination));
});

gulp.task('coffee', function() {
  return gulp.src(paths.scriptsSource + '**/*.coffee')
    .pipe(coffee({bare: true}).on('error', gutil.log))
    .pipe(gulp.dest(paths.tmp + paths.scriptsSource));
});

gulp.task('scripts:vendor', function(callback) {
  return gulp.src([
      './node_modules/jquery/dist/jquery.js'
    ])
    .pipe(sourcemaps.init())
    .pipe(concat('vendor.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.scriptsDestination));
});

gulp.task('concat', function() {
  return gulp.src(paths.tmp + paths.scriptsSource + '**/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('scripts.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.scriptsDestination))
    .pipe(browserSync.stream());
});

gulp.task('templates', function() {
  return gulp.src(paths.templatesSource + '**/*.jade')
    .pipe(jade())
    .pipe(gulp.dest(paths.templatesDestination))
    .pipe(browserSync.stream());
});

gulp.task('styles', function() {
  return gulp.src(paths.cssSource + 'styles.styl')
    .pipe(sourcemaps.init())
    .pipe(stylus({
          paths:  ['node_modules'],
          import: ['nib'],
          use: nib()
        }))
    .pipe(postcss([
      lost(),
      autoprefixer()
    ]))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.cssDestination))
    .pipe(browserSync.stream());
});
