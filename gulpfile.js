const {src, dest, task, series, watch, lastRun, parallel} = require('gulp');
const rm = require('gulp-rm');
const sass = require('gulp-sass')(require('node-sass'));
const pug = require('gulp-pug');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const sassGlob = require('gulp-sass-glob');
const autoprefixer = require('gulp-autoprefixer');
const gcmq = require('gulp-group-css-media-queries');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const gulpif = require('gulp-if');
const remember = require('gulp-remember');

const env = process.env.NODE_ENV;

const {SRC_PATH, DIST_PATH, CSS_LIBS} = require('./gulp.config');

sass.compiler = require('node-sass');

task('clean', () => {
  console.log(env);
  return src(`${DIST_PATH}/**/*`, {read: false}).pipe(rm());
});

task('copy:assets', () => {
  return src(`${SRC_PATH}/assets/**`).pipe(dest(DIST_PATH));
});

task('pug', () => {
  return src(`${SRC_PATH}/pug/*pug`)
    .pipe(sourcemaps.init())
    .pipe(
      pug({
        pretty: true,
        doctype:'HTML'
      })
    )
    .pipe(dest(DIST_PATH));
});

task('styles', () => {
  return src([...CSS_LIBS, `${SRC_PATH}/styles/main.sass`])
    .pipe(gulpif(env === 'dev', sourcemaps.init()))
    .pipe(concat('main.sass'))
    .pipe(sassGlob())
    .pipe(sass().on('error', sass.logError))
    .pipe(
      gulpif(
        env === 'prod',
        autoprefixer({
          cascade: false,
          overrideBrowserslist: [
            "> 1%",
            "ie >= 11",
          ]
        })
      )
    )
    .pipe(gulpif(env === 'prod', gcmq()))
    .pipe(gulpif(env === 'prod', cleanCSS()))
    .pipe(gulpif(env === 'dev',
      sourcemaps.write("./")
    ))
    .pipe(dest(`${DIST_PATH}/css/`));
});

// task('styles:editor', () => {
//     return src(`${SRC_PATH}/stylesAdd/editor.sass`)
//         .pipe(gulpif(env === 'dev', sourcemaps.init()))
//         .pipe(concat('editor.sass'))
//         .pipe(sassGlob())
//         .pipe(sass().on('error', sass.logError))
//         .pipe(
//             gulpif(
//                 env === 'prod',
//                 autoprefixer({
//                     cascade: false,
//                     overrideBrowserslist: [
//                         "> 1%",
//                         "ie >= 11",
//                     ]
//                 })
//             )
//         )
//         .pipe(gulpif(env === 'prod', gcmq()))
//         .pipe(gulpif(env === 'prod', cleanCSS()))
//         .pipe(gulpif(env === 'dev',
//             sourcemaps.write("./")
//         ))
//         .pipe(dest(`${DIST_PATH}/css/`));
// });

task('scripts', () => {
  return src(`${SRC_PATH}/scripts/main/*.js`)
    .pipe(concat('main.js'))
    .pipe(
      babel({
        presets: ['@babel/env'],
      })
    )
    .pipe(dest(`${DIST_PATH}/js/`));
})

task('server', () => {
  browserSync.init({
    server: {
      baseDir: `./${DIST_PATH}`
    },
    open: false
  });
});

task('watch', () => {
  watch(`${SRC_PATH}/assets/**`, series('copy:assets'));
  watch(`${SRC_PATH}/styles/**/*.sass`, series('styles'));
  //watch(`${SRC_PATH}/stylesAdd/editor/*.sass`, series('styles:editor'));
  watch(`${SRC_PATH}/pug/**/**/*.pug`, series('pug'));
  watch(`${SRC_PATH}/scripts/main/*.js`, series('scripts'));
})

task(
  'dev',
  series(
    'clean',
    parallel(
      'copy:assets',
      'styles',
      //'styles:editor',
      'pug',
      'scripts',
    ),
    parallel(
      'server',
      'watch',
    ),
  )
);

task(
  'prod',
  series(
    'clean',
    parallel(
      'copy:assets',
      'styles',
      //'styles:editor',
      'pug',
      'scripts',
    ),
    parallel(
      'server',
      'watch',
    ),
  ),
);