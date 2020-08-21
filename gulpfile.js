const { src, dest, parallel, series, watch} = require('gulp');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const sass         = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCss     = require('gulp-clean-css');

function localHost(){
  browserSync.init({
    server: { baseDir: 'app/'},
    online: true,
  })
}

function scripts(){
  return src([
    'app/js/**/*.js',
  ])
  .pipe(concat('dist.min.js'))
  .pipe(uglify())
  .pipe(dest('dist/js/'))
  .pipe(browserSync.stream())
}

function styles(){
  return src('app/scss/*.scss')
  .pipe(sass())
  .pipe(concat('app.min.css'))
  .pipe(autoprefixer({ 
    overrideBrowserslist : ['last 10 versions'],
    grid : true
  }))
  .pipe(cleanCss(( { 
    level: {1: { specialComments: 0 } },
    /*format: 'beautify'*/
  } )))
  .pipe(dest('app/css/'))
  .pipe(browserSync.stream())
}

function refresh(){
  watch(['app/**/*.js','!app/**/*.min.js'], scripts);
  watch(['app/**/*.scss'], styles);
  watch(['app/**/*.html'],).on('change', browserSync.reload);
}

exports.localHost = localHost;
exports.scripts   = scripts;
exports.styles   = styles;

exports.default   = parallel(scripts, styles, localHost, refresh);