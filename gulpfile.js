const { src, dest, parallel, series, watch} = require('gulp');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;

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
}

function refresh(){
  watch([
    'app/**/*.*',
    '!app/**/*.min.*',
    scripts,
  ])
}

exports.localHost = localHost;
exports.scripts   = scripts;

exports.default   = parallel(scripts, localHost, refresh);