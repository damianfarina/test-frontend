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
    del = require('del'),
    ghPages = require('gulp-gh-pages'),
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
  dist: 'public'
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
  gulp.watch(paths.imagesSource + '**/*', ['images']);
});

gulp.task('build-all', ['styles', 'templates', 'scripts', 'images']);

gulp.task('scripts', ['vendor', 'coffee']);

gulp.task('clean', function () {
  return del([paths.dist + '**/*']);
});

gulp.task('images', function() {
  return gulp.src(paths.imagesSource + '*')
    .pipe(imagemin())
    .pipe(gulp.dest(paths.imagesDestination));
});

gulp.task('coffee', function() {
  return gulp.src(paths.scriptsSource + '**/*.coffee')
    .pipe(sourcemaps.init())
    .pipe(coffee({bare: true}).on('error', gutil.log))
    .pipe(concat('scripts.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.scriptsDestination))
    .pipe(browserSync.stream());
});

gulp.task('vendor', function(callback) {
  return gulp.src([
      './node_modules/jquery/dist/jquery.js'
    ])
    .pipe(sourcemaps.init())
    .pipe(concat('vendor.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.scriptsDestination));
});

gulp.task('templates', function() {
  return gulp.src(paths.templatesSource + '**/*.jade')
    .pipe(jade().on('error', gutil.log))
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

gulp.task('deploy', function() {
  return gulp.src('./public/**/*')
    .pipe(ghPages());
});
