# Builtvisible House Styles v5.0  
![Node](https://s3.amazonaws.com/openshift-hub/production/quickstarts/243/nodejs_custom.png?1456926624) ![Gulp](https://cdn.image.st-hatena.com/image/square/04e564b1874084351cc143978a3ef0936813211d/backend=imagemagick;height=100;version=1;width=100/https%3A%2F%2Fcdn-ak.f.st-hatena.com%2Fimages%2Ffotolife%2Fp%2Fpbrsk%2F20170307%2F20170307222121.jpg) ![HTML](https://image.spreadshirtmedia.com/image-server/v1/mp/compositions/T48A2MPA78PT17X53Y23D11626702S37/views/1,width=100,height=100,appearanceId=2,backgroundColor=E8E8E8,version=1527144656/html5-logo-kids-t-shirt.jpg) ![Sass](https://www.dev-metal.com/wp-content/uploads/2014/03/sass-100x100.png) ![es6](https://static1.squarespace.com/static/57b0d254725e25de8d1c672c/57f028f5c534a5d610fcac23/57f02b1b59cc68fe6a8d39da/1475357641698/es6-tile.jpg?format=100w) ![browserify](https://raw.githubusercontent.com/samiheikki/javascript-guessing-game/master/static/logos/browserify.png)

Gulp 4, Pug-HTML, SCSS-CSS and ES6-ES5 Browserify
-------------------------------------------------



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

### Coding standards

The BV house styles have been written using the following coding standards, which should be used for all projects. These guidelines will likely evolve over time.

___
**General**
___

- Be consistent
- Code should be clean, commented and readable
- Use graceful degradation
- Leave your code tidy, delete commented sections of code prior to completion
- Assume someone else will need to work on your code after you do
- Indent code logically
- Don't repeat yourself

___
**HTML**
___

- Pug preprocessors HTML and gulp will transform it to regular HTML
- Lowercase everything
- New tag, new line
- Ensure HTML is valid
- No inline styles

___
**CSS**
___

- Use lowercase and hyphens for class names
- Newline for each style property and classname
- Don't use IDs for class names
- Don't use !important
- Use names based on structure, not presentation e.g. `.btn-primary` not `.btn-green`
- Don't qualify class names with attribute types e.g. `.well`, not `div.well` 
- Include a comment where a selector is included for a specific, not immediately obvious reason
- Write CSS in a modular way if possible, assume that any element could be included anywhere on the site
- Try to avoid excessive class hierarchy such as `.basket` `.summar` `.details` `.product` `.description` `.price` `{color:#FF000}`
- Don't use page specific classes
- Apply styles using a class name rather than an element name *except for base styles*

___
**JavaScript**
___

- Scripts should only be inline where necessary
- JS should interact with the DOM using either element IDs, data* attributes or class names that have no styles associated with them, and use the naming convention js-classname, to make it really obvious that they are used only by the JavaScript
- Browserify enables modular JS files, you should have JavaScript files for each funcionality divided between core functionality, helper functions, logic and views
- Use braces with all multiline blocks
- Every function should have a comment that briefly explains what it does
- Name functions and variables descriptively
- Camelcase for objects, imported functions and instances

___
**Remember SEO**
___

- Page meta tags including og and any related extra stuff
- Image alt tags
- Correct heading structure
- Semantic markup
- CSS, JS etc. should be minified
- Image sizes should be optimised
- Overall page size should ideally be less than 2MB!

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