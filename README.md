# House Styles v4.0  
![Node](https://s3.amazonaws.com/openshift-hub/production/quickstarts/243/nodejs_custom.png?1456926624) ![Gulp](https://cdn.image.st-hatena.com/image/square/04e564b1874084351cc143978a3ef0936813211d/backend=imagemagick;height=100;version=1;width=100/https%3A%2F%2Fcdn-ak.f.st-hatena.com%2Fimages%2Ffotolife%2Fp%2Fpbrsk%2F20170307%2F20170307222121.jpg) ![HTML](https://image.spreadshirtmedia.com/image-server/v1/mp/compositions/T48A2MPA78PT17X53Y23D11626702S37/views/1,width=100,height=100,appearanceId=2,backgroundColor=E8E8E8,version=1527144656/html5-logo-kids-t-shirt.jpg) ![Sass](https://www.dev-metal.com/wp-content/uploads/2014/03/sass-100x100.png) ![es6](https://static1.squarespace.com/static/57b0d254725e25de8d1c672c/57f028f5c534a5d610fcac23/57f02b1b59cc68fe6a8d39da/1475357641698/es6-tile.jpg?format=100w) ![browserify](https://raw.githubusercontent.com/samiheikki/javascript-guessing-game/master/static/logos/browserify.png)

A conplete Gulp 4 task manager set up to: Pug-HTML, SCSS-CSS and ES6-ES5 with Browserify
----------------------------------------------------------------------------------------

###  Grid generator with Grid.scss

```css
//######### GRID GENERATOR ################

// Max width
$gridwidth: 1000px;

// Margins desktop, tablet
$margin-md: 10px;
$margin-sm: 15px;

// Gutters desktop, tablet, mobile
$gutter-md: 20px;
$gutter-sm: 15px;
$gutter-xs: 10px;

// Number of columns
$columns: 12;

.container {
  max-width: $gridwidth;
  margin: 0 auto;
}

// Grid Mixins 
  
// Calculates padding for row and gutter for columns
@mixin calcPadding($padding) {
  padding-right: $padding;
  padding-left:  $padding;
}

// Creates 12 columns and offsets and calculates its width
@mixin createColumns($breakpoint) {
  @for $i from 1 through $columns {
    .col-#{$breakpoint}-#{$i} { 
      flex: ((100 / $columns) * $i) * 1%;
      max-width: ((100 / $columns) * $i) * 1%;
    }
    .offset-#{$breakpoint}-#{$i} { margin-left: ((100 / $columns) * $i) * 1% }
  }
}

// Flexbox grid
.row {
  display: flex;
  flex-flow: row wrap;
  transition: all 0.3s ease;
  @include calcPadding($margin-sm)
  &.reverse { flex-flow: row-reverse wrap-reverse }
  &.center { justify-content: center }
}

[class*='col'] {
  width: 100%;
  margin: 1em auto;
  @include calcPadding($gutter-xs)
  &.reverse { flex-flow: column-reverse wrap-reverse }
}

@include createColumns(xs)

// Media queries
@include mobile {
  .row.full { 
    @include calcPadding(0);
    [class*='col'] { @include calcPadding(0) }
  } 
}

@include tablet {
  .row { @include calcPadding($margin-sm) }
  @include createColumns(sm)
}

@include tabletLrg {
  .row { @include calcPadding($margin-md) }
  @include createColumns(md)
}

@include desktop {
  .row { @include calcPadding($margin-md) }
  [class*="col"] { @include calcPadding($gutter-md) }
  @include createColumns(lg)
}
```

###  Pure JavaScript sharing generator 

```js
setSharing() {
  const getMetaContentByName = (name, attrtype, content) => {
    content = content == null ? 'content' : content
    const ret = select('meta[' + attrtype + '=\'' + name + '\']').getAttribute(content)
    return ret.replace(/ /gi, '%20');
  }
  
  each(selectAll('.social li'), els => {
    let txt = els.innerHTML.replace(/SBTITLE/gi, getMetaContentByName('og:title', 'property'))
    txt = txt.replace(/SBLINK/gi, escape(window.location.href))
    els.innerHTML = txt
  })
}
```

### Mini JS library to manipulate DOM

```js
// Helper functions to manipulate DOM, format numbers, capiltalise strings and validate email forms
export const
  // Select single element
  select     = el  => document.querySelector(el),
  // Select Nodelist array of elements
  selectAll  = els => document.querySelectorAll(els),
  // Select elements by id
  getId      = id  => document.getElementById(id),
  // Capitalise string
  caps       = str => str.charAt(0).toUpperCase() + str.slice(1),
  // Correct email format regex
  regexEmail = input => input.value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/),
  // Make foreach available for Nodelists arrays
  each       = (array, callback) => {
    for (let i = 0, j = array.length; i < j; i++) callback.call(i, array[i])
  },
  // Multi addEventListener, takes multiple parameters ('click load change etc')
  listen     = (el, s, fn) => each(s.split(' '), e => el.addEventListener(e, fn, false))
```

### Quick start

Make sure node.js version is up to date, current node_modules correspond to v10.6.0.

Clone the repo and run `npm install`. If you prefer not to use Pug for html markup use `git fetch && git checkout nopug`, to change branch.

> Tip: Use [npm-update-all](https://www.npmjs.com/package/npm-update-all) to get the latest version of each packet in case there is an error with an obsolete package. Make sure you manually change gulp on the package.json to version 4.0.0 if you use this method and then run `npm install` again.

For all subsequent uses, just run `gulp --dev` to develop.

For production use `gulp built` to compile Pug to HTML, autoprefix, optimise images and minimise css and JavaScript.

###### Note, Windows users may need to run the initial command more than once for it to complete successfully.

### General usage notes

- Make all changes in `src/` directory, minified/compressed files is then output by gulp to `dist/` *this folder will be deleted everytime gulp is run*.
- Images should be put in `src/static/img/`. Gulp will apply compression without reducing their quality.
- JavaScript files should go in `src/static/js/`. Gulp will perform eslint on your code and and browserify will compile and compress all JavaScript files into a single main.min.js.
- Anything not CSS/JS/images should go in `src/static/assets/` e.g. fonts, videos, other files.
- Autoprefixer offers Browser support for IE11 and above 

### Use of Gulp

There is a `gulpfile.js` within this repository to make development much quicker for the house styles. All you need to do is:

- Install [**Node**](http://nodejs.org) & [**Gulp**](https://gulpjs.org/getting-started)
- Run `npm install`

This will install all the dependencies found in `package.json`, then run the local server through the `gulp` command.

> Note: The `node_modules` folder will not be pushed to the repository as the .gitignore file is present on the repo.

###### Note for Windows users with Git Bash: you may need to run 'npm run setup' a couple of times for it to finally work.
  
This will open up a tab in your browser, running a server at `localhost:3000` (unless you have set up a proxy server address - details on how to change this are in the `gulpfile.js` file).

### NPM Packages

| Name | Description |
| --- | ----------- |
| **gulp** | The streaming build system. |
| **browser-sync** | Live CSS Reload & Browser Syncing |
| **gulp-sass** |  Converts SASS files in CSS |
| **gulp-pug** | This Gulp plugin enables you to compile your Pug templates into HTML |
| **gulp-sourcemaps** | Source map support for Gulp.js |
| **gulp-autoprefixer** | Prefix CSS after conversion from SASS. |
| **gulp-uglify** | Minify JS files with UglifyJS. |
| **gulp-bytediff** | Compare file sizes before and after your gulp build process. |
| **gulp-cache** | A cache proxy plugin for Gulp. |
| **gulp-concat** | Concatenates files. |
| **gulp-duration** | Track the duration of parts of your gulp tasks. |
| **gulp-exit** | Terminates gulp task. |
| **gulp-cssmin** | Minify css using gulp. |
| **gulp-imagemin** | Compresses images - packaged with gifsicle, jpegtran, optipng, and svgo. |
| **gulp-load-plugins** | Automatically load any gulp plugins in your package.json. |
| **gulp-newer** | Only pass through newer source files. |
| **gulp-notify** | Gulp plugin to send messages based on Vinyl Files or Errors to OS. |
| **gulp-plumber** | Prevent pipe breaking caused by errors from gulp plugins. |
| **gulp-rename** | Rename files. |
| **gulp-util** | Utility functions for gulp plugins. |
| **babel-core** | Babel compiler core. |
| **babel-eslint** | babel-eslint allows you to lint ALL valid Babel code with ESLint. |
| **babel-plugin-add-module-exports** | This plugin adds that line automatically, to any module with named exports. |
| **babel-preset-env** | A Babel preset that compiles ES2015+ down to ES5. |
| **babelify** | Babel browserify transform. |
| **browserify** | Use a node-style require() to organize your browser code and load modules installed by npm.. |
| **watchify** | Watch mode for browserify builds. |
| **eslint-friendly-formatter** | Simple formatter/reporter for eslint that's friendly with Sublime Text and  |iterm2. |
| **eslintify** | Stream module for linting JavaScript programs.. |
| **vinyl-buffer** | Convert streaming vinyl files to use buffers. |
| **vinyl-source-stream** | Use conventional text streams at the start of your gulp or vinyl pipelines. |
| **del** | Enables the deleting of files. |

### BrowserSync
  
The main component of this Gulp setup is BrowserSync. This plugin provides the following advantages for development:  

- Automatic page reload of the browser when HTML, JS, Images or Assets files are updated and injection when CSS is updated
- Simultaneous page scrolling for all devices connected to the same link  
- Clicking links or populating form fields on one device will duplicate this behaviour on all other linked devices  
- A dashboard at `localhost:3001` where you can send commands to all connected devices, perform actions and do network throttle testing.