var gulp = require("gulp"),
    runSequence = require('run-sequence'),
    process = require("process"),
    minimist = require("minimist"),
    $ = require('gulp-load-plugins')(),
    del = require("del"),
    browserSync = require('browser-sync'),
    paths = {
      configFile  : './config.json',
      tmpfile     : 'tmpfilename',
      varsDir     : './vars/',
      srcDir      : './src/',
      buildDir    : './build/',
      testDir     : './tests/',
      examplesDir : './examples/',
      docsDir     : './docs/gen/'
    },
    config = require(paths.configFile),
    argv = minimist(process.argv.slice(2)),
    vars,
    env;

const extJs = '.js';
const extJson = '.json';
const extMin = '.min';
const astarisk = '*';

gulp.task('default', function(callback) {
  return runSequence('config', 'concat', 'expand', 'beauty', 'minify', 'jshint', 'mochaTest', 'jsdoc3', 'browserSync', terminate);
});

gulp.task('config', function() {
  if (['dev','prod','stage'].indexOf(argv['e']) < 0) {
    env = 'dev';
  } else {
    env = argv['e'];
  }
  vars = require(paths.varsDir + env + extJson);
  if (!vars) {
    process.exit(-1);
  }
  del(['dist', paths.buildDir + astarisk + extJs]);
});

gulp.task('concat', function() {
  if (!config.concat.enabled) {
    console.log("skip");
    return;
  }
  return gulp.src(config.concat.order)
    .pipe($.plumber())
    .pipe($.concat(paths.tmpfile + extJs))
    .pipe(gulp.dest(paths.buildDir));
});

gulp.task('expand', ['concat'], function() {
  if (!config.expand.enabled) {
    console.log("skip");
    return;
  }
  var tmp = gulp.src(paths.buildDir + paths.tmpfile + extJs);
  var val, mod;
  for (k in vars) {
    val = config.expand.prefix + k + config.expand.suffix;
    mod = vars[k];
    tmp.pipe($.replace(val, mod));
  }
  return tmp.pipe($.rename(config.outputName + extJs))
    .pipe(gulp.dest(paths.buildDir));
});

gulp.task('beauty', function() {
  if (!config.beautifier.enabled) {
    console.log("skip");
    return;
  }
  return gulp.src(paths.buildDir + config.outputName + extJs)
    .pipe($.plumber())
    .pipe($.jsbeautifier({
      indent_char : config.beautifier.indentChar,
      indent_size : config.beautifier.indentSize,
      eol : config.beautifier.eol,
      end_with_newline : config.beautifier.endWithNewline
    }))
    .pipe($.convertEncoding({
      to: config.beautifier.convertEncoding
    }))
    .pipe($.diff())
    .pipe($.diff.reporter())
    .pipe(gulp.dest(paths.buildDir));
});

gulp.task('minify', function() {
  if (!config.minify.enabled) {
    console.log("skip");
    return;
  }
  del(['dist', paths.buildDir + paths.tmpfile + astarisk + extJs]);
  return gulp.src(paths.buildDir + config.outputName + extJs)
    .pipe($.plumber())
    .pipe($.uglify())
    .pipe($.rename(config.outputName + extMin + extJs))
    .pipe(gulp.dest(paths.buildDir));
});

gulp.task('jshint', function() {
  if (!config.jshint.enabled) {
    console.log("skip");
    return;
  }
  return gulp.src(paths.buildDir + config.outputName + extJs)
    .pipe($.plumber())
    .pipe($.jshint(config.jshint.rcfile))
    .pipe($.jshint.reporter('jshint-stylish'));
});

gulp.task('mochaTest', function() {
  if (!config.mochaTest.enabled) {
    console.log("skip");
    return;
  }
  return gulp.src([paths.testDir + astarisk + extJs], {
    read: false
  }).pipe($.mocha());
});

gulp.task('jsdoc3', function(cb) {
  if (!config.jsdoc3.enabled) {
    console.log("skip");
    return gulp.src('./');
  } else {
    gulp.src(['README.md', paths.buildDir + astarisk + extJs], {
      read: false
    }).pipe($.jsdoc3(cb));
  }
});

gulp.task('browserSync', function() {
  if (!config.browserSync.enabled) {
    console.log("skip");
    return;
  }
  browserSync({
    open : config.browserSync.open,
    host : config.browserSync.host,
    port : config.browserSync.port,
    logLevel : config.browserSync.logLevel,
    logConnections : config.browserSync.logConnections,
    reloadOnRestart : config.browserSync.reloadOnRestart,
    server: {
      directory : true,
      baseDir : config.browserSync.server.baseDir,
      index : config.browserSync.server.indexFile
    },
    files : [paths.examplesDir + astarisk, paths.buildDir + astarisk + extJs],
	ui: {
      port : config.browserSync.ui.port
    }
  });
});

gulp.task('bs-reload', function() {
  browserSync.reload();
});

function terminate() {
  del(['dist', paths.buildDir + paths.tmpfile + astarisk + extJs]);
  gulp.watch([paths.srcDir + astarisk + extJs, paths.configFile, paths.varsDir + astarisk + extJson], function() {
    return runSequence('concat', 'expand', 'beauty', 'minify', 'jshint', 'mochaTest', 'jsdoc3');
  });
  gulp.watch([paths.buildDir + config.outputName + extJs, paths.examplesDir + astarisk], ['bs-reload']);
}
