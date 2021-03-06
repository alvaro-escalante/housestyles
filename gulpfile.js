'use strict'
// File paths
const paths = {
  images: {
    src:  'src/static/img/',
    dest: 'dist/static/img/'
  },
  scripts: {
    src:  'src/static/js/',
    dest: 'dist/static/js/'
  },
  styles: {
    src:  'src/static/scss/',
    dest: 'dist/static/css/'
  },
  assets: {
    src:  'src/static/assets/',
    dest: 'dist/static/assets/'
  }
},
// Initialization
gulp = require('gulp'),
$ = require('gulp-load-plugins')({ pattern: '*', camelize: true }),
browserSync = $.browserSync.create(),
dev = !!$.util.env.dev,
// Styles SCSS to CSS
Styles = () => {
  // Notification in the terminal on error
  function onError(err) {
    $.notify({
      title: 'CSS Error',
      subtitle: 'Syntax error on ' + err.relativePath.split('/')[3],
      message: '📍 LINE: ' + err.line + ' - See terminal'
    }).write(err)
    let report = 
      $.util.colors.white('\n📍  CSS Error') +
      $.util.colors.red('\n🔥  File: ') +
      $.util.colors.yellow(err.relativePath.split('/')[3]) +
      $.util.colors.red('\n🔥  Line: ') +
      $.util.colors.yellow(err.line) +
      $.util.colors.red('\n🔥  Message: ') +
      $.util.colors.yellow(err.messageOriginal) + '\n'
    console.log(report)
    this.emit('end')
  }
  return gulp.src(paths.styles.src + 'styles.scss')
    .pipe($.plumber({errorHandler: onError})) // Process error
    .pipe($.newer(paths.styles.dest)) // Rewrite destination dist
    .pipe(dev ? $.sourcemaps.init() : $.util.noop()) // Enable sourcemaps
    .pipe($.sass()) // Process Sass to produce css
    .pipe($.concat('styles.min.css')) // Concat all scss into one css file
    .pipe(dev ? $.util.noop() : $.autoprefixer() ) // Process vendor prefixes
    .pipe(dev ? $.util.noop() : $.bytediff.start()) // Compare file sizes before min
    .pipe(dev ? $.util.noop() : $.cssmin()) // Compress css
    .pipe(dev ? $.util.noop() : $.bytediff.stop()) // Compare file sizes after min
    .pipe(dev ? $.sourcemaps.write('./_maps') : $.util.noop()) // Process map file
    .pipe(gulp.dest(paths.styles.dest)) // Deliver to dist
    .pipe(browserSync.stream({match: '*.css'})) // Stream browser to reflec changes
},
// Scripts ES6 Babel to ES5
Scripts = build => {
  // Map errors
  const mapError = function(error) {
    $.notify({
      title: 'Javascript Error',
      subtitle: 'Syntax error in script!',
      message: error.message,
      icon: 'node_modules/gulp-notify/assets/gulp-error.png'
    }).write(error)
    this.emit('end')
  },
  // Options
  opts = {
    entries: `${paths.scripts.src}main.js`,
    extensions: ['.js'],
    cache: {}, // <---- here for optimization 
    packageCache: {}, // <----  here
    debug: dev // <----  and here
  }

  let transform = mode => mode.transform($.eslintify).transform($.babelify, {'sourceMaps': dev })
  
  const built = transform($.browserify(opts)), 
        watch = transform($.watchify($.browserify(opts))),

  bundle = type => type
    .bundle()
    .on('error', mapError) // Map error reporting
    .pipe($.vinylSourceStream('main.js')) // Set source name
    .pipe($.vinylBuffer()) // Convert to gulp pipeline
    .pipe(dev ? $.util.noop() : $.bytediff.start())
    .pipe(dev ? $.util.noop() : $.uglify())
    .pipe(dev ? $.util.noop() : $.bytediff.stop())
    .pipe($.rename('main.min.js')) // Rename the output file
    .pipe(gulp.dest(paths.scripts.dest)) // Set the output folder
    .pipe(browserSync.stream()) // Reload the view in the browser

  watch.on('update', bundle.bind(null, watch)) // on any dep update, runs the bundler

  return build === 'build' ? bundle(built) : bundle(watch)
},
// HTML Regular
// Html = () => {
//  return gulp.src('src/**/*.pug')
//   //.pipe($.htmlmin({collapseWhitespace: true, minifyJS: true, minifyCSS: true}))
//   .pipe($.newer('dist/'))
//   .pipe(gulp.dest('dist/'))
//   .pipe(browserSync.stream())
// },
// HTML Pug
Html = () => {
 const mapError = function(error) {
    return $.notify({
      title: 'html Error',
      subtitle: 'Syntax error in pug file!',
      message: error,
      sound: 'Beep',
      icon: 'node_modules/gulp-notify/assets/gulp-error.png'
    }).write(error)
    this.emit('end')
  }

  return gulp.src('src/**/*.pug')
  .pipe($.pug({ pretty: true }))
  .on('error', mapError)
  .pipe($.newer('dist/'))
  .pipe(gulp.dest('dist/'))
},
// Images
Images = () => {
  return gulp.src(`${paths.images.src}**/*`,{base: paths.images.src})
    .pipe($.plumber(function(error) {
      $.util.log($.util.colors.red(`Error (${error.plugin}):  ${error.message}`))
      this.emit('end')
    }))
    .pipe($.newer(paths.images.dest))
    .pipe(dev ? $.util.noop() : $.imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest(paths.images.dest))
},
// Assets
Assets = () => {
  return gulp.src(`${paths.assets.src}**/*`) 
    .pipe($.newer(paths.assets.dest))
    .pipe(gulp.dest(paths.assets.dest))
},
// Clear destination dir
Clear = done => {
  $.del.sync('dist/static')
  $.del.sync('dist/index.html')
  done()
},
// BrowserSync 
Browsersync = () => {
   browserSync.init(`${paths.styles.dest}*.css`, {
    server: './dist/',
    notify: true,
    debug: false
  })
  gulp.watch('src/**/*.pug', gulp.series(Html)).on('change', browserSync.reload)
  gulp.watch(`${paths.styles.src}**/*.scss`, gulp.series(Styles))
  gulp.watch(`${paths.images.src}**/*`, gulp.series(Images)).on('change', browserSync.reload)
  gulp.watch(`${paths.assets.src}**/*`, gulp.series(Assets)).on('change', browserSync.reload)
},

// Tasks setup
series = [Clear, Html, Styles, Images, Assets]

// Initialise tasks
gulp.task('default', gulp.series(series, gulp.parallel(Scripts, Browsersync)))
gulp.task('built', gulp.series(series, Scripts.bind(null, 'build')))