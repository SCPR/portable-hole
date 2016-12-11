'use strict';

const gulp       = require('gulp'),
      browserify = require('browserify'),
      source     = require('vinyl-source-stream'),
      babel      = require('babelify'),
      stringify  = require('stringify'),
      fs         = require('fs'),
      path       = require('path'),
      glob       = require('glob'),
      aliasify   = require('aliasify')

gulp.task('browser-compile', () => {

  // Create a tmp directory if it doesn't exist.

  if (!fs.existsSync("./tmp")){
      fs.mkdirSync("./tmp");
  }

  let b = browserify()

  b.require('./lib/portable-holes.js', {expose: 'portable-holes'})

  // CRAZY THINGS HAPPEN HERE
  // We have to make a fake glob module because it depends on some
  // fs functions we can't easily shoehorn.
  //
  // Changes need to happen to the paths for them to be supported both on the backend
  // and in the browser.  Need to clean this up later if possible.

  let globs = {
    "/lib/adapters/*.js": glob.sync("./lib/adapters/*.js").map((p) => {return p.replace(/^\./, '')}),
    "/lib/templates/*.hbs": glob.sync("./lib/templates/*.hbs")
  }
  let falseGlob = `module.exports = {sync: function(pathName){return ${JSON.stringify(globs)}[pathName];}}`;
  fs.writeFile('./tmp/false-glob.js', falseGlob);

  // Here, we explicitly include the adapters and templates
  // because we call them dynamically in the script.   
  glob.sync(`./lib/adapters/*.js`).forEach((file) => {
    b = b.require(file, {expose: file});
  });

  let files = {}
  glob.sync("./lib/templates/*.hbs").forEach((file) => {
    files[file.replace(/^\./, '')] = fs.readFileSync(file, 'utf-8');
  });
  let falseFs = `module.exports = {readFileSync: function(pathName){return ${JSON.stringify(files)}[pathName];}}`;
  fs.writeFile('./tmp/false-fs.js', falseFs);
  // CRAZY THINGS STOP HERE

  b
    .transform("aliasify", {aliases: { glob: './tmp/false-glob.js', fs: './tmp/false-fs.js' }})
    .transform("babelify", {presets: ["es2015"]})
    .bundle()
    .pipe(source('portable-holes.js'))
    .pipe(gulp.dest("./dist/"));
});

gulp.task('default', ['browser-compile']);
