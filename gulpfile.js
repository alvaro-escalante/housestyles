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
source = require('vinyl-source-stream'),
formatter = require('eslint-friendly-formatter'),
$ = require('gulp-load-plugins')({ pattern: '*', camelize: true }),
prefix = { 
  browsers: [
  'iOS >= 8',
  'Chrome >= 30',
  'Explorer >= 11',
  'Last 2 Edge Versions',
  'Firefox >= 25' 
]},
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
    .pipe(dev ? $.util.noop() : $.autoprefixer(prefix) ) // Process vendor prefixes
    .pipe(dev ? $.util.noop() : $.bytediff.start()) // Compare file sizes before min
    .pipe(dev ? $.util.noop() : $.cssmin()) // Compress css
    .pipe(dev ? $.util.noop() : $.bytediff.stop()) // Compare file sizes after min
    .pipe(dev ? $.sourcemaps.write('./_maps') : $.util.noop()) // Process map file
    .pipe(gulp.dest(paths.styles.dest)) // Deliver to dist
    .pipe(browserSync.stream({match: '*.css'})) // Stream browser to reflec changes
},
// Scripts ES6 Babel to ES5
Scripts = watch => {
  // Map errors
  const mapError = function(error) {
    $.notify({
      title: 'Javascript Error',
      subtitle: 'Syntax error in script!',
      message: 'Error in JavaScript - See terminal',
      icon: 'node_modules/gulp-notify/assets/gulp-error.png'
    }).write(error)
    this.emit('end')
  },
  bundler = $.watchify($.browserify({
    entries: `${paths.scripts.src}main.js`,
    extensions: ['.js'],
    cache: {}, // <---- here is important things for optimization 
    packageCache: {}, // <----  here
    debug: dev // <----  and here
  }))
  .transform($.eslintify, {
    'parserOptions': { 'ecmaVersion': 7, 'sourceType': 'module' },
    'parser': 'babel-eslint',
    'rules': { quotes: ["error", "single", { avoidEscape: true, allowTemplateLiterals: true}]}
  })
  .transform($.babelify, {
    'sourceMaps': dev,
    'presets': [["env", { "targets": {"ie": "11"} }]],
    'plugins': ['add-module-exports'],
    'ignore':  ['src/static/assets/**', 'src/static/scss/**']
  }),
  rebundle = () => {
    return bundler
      .bundle()
      .on('error', mapError) // Map error reporting
      .pipe(source('main.js')) // Set source name
      .pipe($.vinylBuffer()) // Convert to gulp pipeline
      .pipe(dev ? $.util.noop() : $.bytediff.start())
      .pipe(dev ? $.util.noop() : $.uglify())
      .pipe(dev ? $.util.noop() : $.bytediff.stop())
      .pipe($.rename('main.min.js')) // Rename the output file
      .pipe(gulp.dest(paths.scripts.dest)) // Set the output folder
      .pipe($.duration((dev ? 'Script compiled in':'Finished built'))) // Duration
      .pipe(browserSync.stream()) // Reload the view in the browser
  }
  bundler.on('update', () => rebundle()) // Reload on changes 
  rebundle()
},
// HTML Pug
Html = buildHTML => {
  // Notification in terminal on error
  function mapError(err) {
    $.notify({
      title: 'HTML Pug Error',
      subtitle: 'Syntax error in Pug!',
      message: '📍 LINE: ' + err.line + ' - See terminal'
    }).write(err)
    let report = 
      $.util.colors.white('\n📍  HTML Error') + 
      $.util.colors.red('\n💣  Code: ') + 
      $.util.colors.yellow(err.code) + 
      $.util.colors.red('\n💣  Line: ') + 
      $.util.colors.yellow(err.line) +  
      $.util.colors.red('\n💣  Message: ') + 
      $.util.colors.yellow(err.msg) + '\n'
    console.log(report)
    this.emit('end')
  }
  // Perform tasks
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
development = gulp.series(Clear, Html, Styles, Images, Assets, gulp.parallel(Scripts, Browsersync)),
built = gulp.series(Clear, Html, Styles, Images, Assets, Scripts)
// Initialise tasks
gulp.task('default', development)
gulp.task('built', built)