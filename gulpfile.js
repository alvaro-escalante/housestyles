'use strict'
// File paths
const paths = {
  templates: {
    src: 'src/',
    dest: 'dist/'
  },
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
  $ = require('gulp-load-plugins')({
    pattern: '*',
    camelize: true
  }),
  prefix = { browsers: [
    'iOS >= 8',
    'Chrome >= 30',
    'Explorer >= 11',
    'Last 2 Edge Versions',
    'Firefox >= 25'
  ]},
  browserSync = $.browserSync.create(),
  dev = !!$.util.env.dev,
// Styles SCSS
styles = () => {
  function onError(err) {
    $.notify({
      title: 'CSS Error',
      subtitle: 'Syntax error in CSS!',
      message: 
        $.util.colors.red('\n\n⚡ File: ') + 
        $.util.colors.yellow(err.relativePath.split('/')[3]) + 
        $.util.colors.red('\n⚡ Line: ') + 
        $.util.colors.yellow(err.line) +  
        $.util.colors.red('\n⚡ Message: ') + 
        $.util.colors.yellow(err.messageOriginal) + '\n'
    }).write(err)
    this.emit('end')
  }

  return gulp.src(paths.styles.src + 'styles.scss')
    .pipe($.plumber({errorHandler: onError}))
    .pipe($.newer(paths.styles.dest))
    .pipe(dev ? $.sourcemaps.init() : $.util.noop())
    .pipe($.sass())
    .pipe($.concat('styles.min.css'))
    .pipe(dev ? $.util.noop() : $.autoprefixer(prefix) )
    .pipe(dev ? $.util.noop() : $.bytediff.start() )
    .pipe(dev ? $.util.noop() : $.cssmin())
    .pipe(dev ? $.util.noop() : $.bytediff.stop())
    .pipe(dev ? $.sourcemaps.write('./_maps') : $.util.noop())
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.stream({match: '*.css'}))
},
// Scripts ES6 Babel
compile = watch => {
  // Map errors
  const mapError = function(error) {
    return $.notify({
      title: 'Javascript Error',
      subtitle: 'Syntax error in script!',
      message: error,
      sound: 'Beep',
      icon: 'node_modules/gulp-notify/assets/gulp-error.png'
    }).write(error)
    this.emit('end')
  },
  bundler = $.watchify($.browserify({
    entries: `${paths.scripts.src}main.js`,
    extensions: ['.js'],
    cache: {}, // <---- here is important things for optimization 
    packageCache: {}, // <----  and here
    dev
  }))
  .transform($.eslintify, {
    'parserOptions': {
      'ecmaVersion': 7,
      'sourceType': 'module'
    },
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
  bundler.on('update', () => rebundle())
  rebundle()
}, 
// HTML Pug
html = buildHTML => {
  function mapError(err) {
    $.notify({
      title: 'HTML Pug Error',
      subtitle: 'Syntax error in Pug!',
      message: 
        $.util.colors.red('\n\n⚡ Code: ') + 
        $.util.colors.yellow(err.code) + 
        $.util.colors.red('\n⚡ Line: ') + 
        $.util.colors.yellow(err.line) +  
        $.util.colors.red('\n⚡ Message: ') + 
        $.util.colors.yellow(err.msg) + '\n'
    }).write(err)
    this.emit('end')
  }

  return gulp.src(`${paths.templates.src}**/*.pug`)
  .pipe($.pug({ pretty: true }))
  .on('error', mapError)
  .pipe($.newer(paths.templates.dest))
  .pipe(gulp.dest(paths.templates.dest))
},
// Images
images = () => {
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
assets = () => {
  return gulp.src(`${paths.assets.src}**/*`) 
    .pipe($.newer(paths.assets.dest))
    .pipe(gulp.dest(paths.assets.dest))
},
// Clean destination dir
clean = done => {
  $.del.sync(paths.templates.dest + 'static')
  $.del.sync(paths.templates.dest + 'index.html')
  done()
},
// BrowserSync 
Browsersync = () => {
  browserSync.init(`${paths.styles.dest}*.css`, {
    server: './dist/',
    notify: true,
    debug: false
  })  
  gulp.watch(`${paths.templates.src}**/*.pug`, gulp.series(html)).on('change', browserSync.reload)
  gulp.watch(`${paths.styles.src}**/*.scss`, gulp.series(styles))
  gulp.watch(`${paths.images.src}**/*`, gulp.series(images)).on('change', browserSync.reload)
  gulp.watch(`${paths.assets.src}**/*`, gulp.series(assets)).on('change', browserSync.reload)
},
// Tasks setup
development = gulp.series(clean, html, styles, images, assets, gulp.parallel(Browsersync, compile)),
built = gulp.series(clean, html, styles, images, assets, compile)
// Initialise tasks
gulp.task('default', development)
gulp.task('built', built)