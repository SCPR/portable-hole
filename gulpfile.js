'use strict';

const gulp       = require('gulp'),
      browserify = require('browserify'),
      source     = require('vinyl-source-stream'),
      babel      = require('babelify'),
      stringify  = require('stringify'),
      fs         = require('fs'),
      path       = require('path'),
      glob       = require('glob'),
      aliasify   = require('aliasify'),
      uglify     = require('gulp-uglify'),
      sourceMaps = require('gulp-sourcemaps'),
      buffer     = require('vinyl-buffer');

gulp.task('compile', () => {

  // Create a tmp directory if it doesn't exist.

  if(!fs.existsSync('./tmp')) fs.mkdirSync('./tmp');

  let b = browserify({
    standalone: 'PortableHoles'
  });

  b.require('./lib/portable-holes.js', {expose: 'portable-holes'});

  // CRAZY THINGS HAPPEN HERE
  // We have to make a fake glob module because it depends on some
  // fs functions we can't easily shoehorn.
  //
  // Changes need to happen to the paths for them to be supported both on the backend
  // and in the browser.  Need to clean this up later if possible.

  const globs = {
    '/lib/adapters/*.js': glob.sync('./lib/adapters/*.js').map(p => p.replace(/^\./, '')),
    '/lib/templates/*.hbs': glob.sync('./lib/templates/*.hbs')
  };
  const fakeGlob = `module.exports = {sync: function(pathName){return ${JSON.stringify(globs)}[pathName];}}`;
  fs.writeFile('./tmp/fake-glob.js', fakeGlob);

  // Here, we explicitly include the adapters and templates
  // because we call them dynamically in the script.   
  glob.sync(`./lib/adapters/*.js`).forEach(file => b = b.require(file, {expose: file}));

  const files = {}
  glob.sync("./lib/templates/*.hbs").forEach((file) => {
    files[file.replace(/^\./, '')] = fs.readFileSync(file, 'utf-8');
  });
  const fakeFs = `module.exports = {readFileSync: function(pathName){return ${JSON.stringify(files)}[pathName];}}`;
  fs.writeFile('./tmp/fake-fs.js', fakeFs);
  // CRAZY THINGS STOP HERE

  b
    .transform('aliasify', {aliases: { glob: './tmp/fake-glob.js', fs: './tmp/fake-fs.js' }})
    .transform('babelify', {presets: ['es2015']})
    .bundle()
    .pipe(source('portable-holes.js'))
    .pipe(buffer())
    .pipe(sourceMaps.init({loadMaps: true}))
    .pipe(uglify({mangle: true}))
    .pipe(sourceMaps.write('./'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('default', ['compile']);

