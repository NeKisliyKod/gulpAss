let gulp         = require('gulp'),
    sass         = require('gulp-sass'),
    pug          = require('gulp-pug'),
    htmlbeautify = require('gulp-html-beautify'),
    browserSync  = require('browser-sync'),
    // uglify = require('gulp-uglify'),
    uglify       = require('gulp-uglify-es').default,
    concat       = require('gulp-concat'),
    rename       = require('gulp-rename'),
    del          = require('del'),
    autoprefixer = require('gulp-autoprefixer');

  
gulp.task('html', ()=> {
  return gulp.src('app/**/*.html')
  .pipe(browserSync.reload({stream: true}))
});

gulp.task('pug', ()=> {
  return gulp.src('app/pug/index.pug')
    .pipe(pug())
    .pipe(htmlbeautify())
    .pipe(gulp.dest('app'))
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('htmlbeautify', ()=> {
  let options = {
    indentSize: 2,
    unformatted:[
      'abbr', 'div', 'span', 'area', 'b', 'sub', 'sup', 'a', 'strong'
    ]
  };
  gulp.src('app/*.html')
    .pipe(htmlbeautify(options))
    .pipe(gulp.dest('app'))
});

gulp.task('scss', ()=> {
  return gulp.src('app/scss/style.scss')
  .pipe(autoprefixer({
    overrideBrowserslist:['last 8 version']
  }))
  .pipe(sass({outputStyle: 'expanded'})) //compressed
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest('app/css'))
  .pipe(browserSync.reload({stream: true}))
});

gulp.task('js', ()=> {
  del.sync('app/js/js.min.js')
  return gulp.src(['app/js/*.js'])
  .pipe(concat('js.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('app/js'))
  .pipe(browserSync.reload({stream: true}))
});

gulp.task('browser-sync', ()=> {
  browserSync.init({
      server: {
          baseDir: "app/"
      }
  });
});

gulp.task('build', async ()=> {
  let buildHtml = gulp.src('app/**/*.html')
      .pipe(gulp.dest('dist'));

  let buildCss = gulp.src('app/css/**/*.css')
      .pipe(gulp.dest('dist/css'));

  let buildJs = gulp.src('app/js/js.min.js')
      .pipe(gulp.dest('dist/js'));

  let buildFonts = gulp.src('app/fonts/**/*.*')
      .pipe(gulp.dest('dist/fonts'));

  let buildImg = gulp.src('app/img/**/*.*')
      .pipe(gulp.dest('dist/img'));
});

gulp.task('clean', ()=> {
  del.sync('dist')
});

gulp.task('watch', ()=> {
  gulp.watch('app/scss/**/*.scss', gulp.parallel('scss'));
  gulp.watch('app/**/*.html', gulp.parallel('html'));
  gulp.watch('app/js/main.js', gulp.parallel('js'));
  gulp.watch('app/pug/*.pug', gulp.parallel('pug'));
});

gulp.task('default', gulp.parallel('scss', 'js' ,'browser-sync', 'watch'))