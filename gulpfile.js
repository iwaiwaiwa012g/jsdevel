var gulp = require("gulp"),
    runSequence = require('run-sequence'),
    process = require("process"),
    minimist = require("minimist"),
    $ = require('gulp-load-plugins')(),
    del = require("del"),
    browserSync = require('browser-sync');

var paths = {
      configFile  : './config.json',
      tmpfile     : 'tmpfilename',
      varsDir     : './vars/',
      srcDir      : './src/',
      buildDir    : './build/',
      testDir     : './tests/',
      examplesDir : './examples/',
      docsDir     : './docs/gen/'
    };

var config = require(paths.configFile);
var argv = minimist(process.argv.slice(2)),vars,env;

gulp.task('default', function(callback) {
  return runSequence('config', 'concat', 'expand', 'beauty', 'minify', 'jshint', 'mochaTest', 'jsdoc3', 'browserSync', terminate);
});

function terminate() {
  del(['dist', paths.buildDir + paths.tmpfile + '*' + '.js']);
  gulp.watch([paths.srcDir + '*' + '.js', paths.configFile, paths.varsDir + '*' + '.json'], function() {
    return runSequence('concat', 'expand', 'beauty', 'minify', 'jshint', 'mochaTest', 'jsdoc3');
  });
  gulp.watch([paths.buildDir + config.outputName + '.js', paths.examplesDir + '*'], ['bs-reload']);
}

gulp.task('config', function() {
  if (['dev','prod','stage'].indexOf(argv['e']) < 0) {
    env = 'dev';
  } else {
    env = argv['e'];
  }
  vars = require(paths.varsDir + env + '.json');
  if (!vars) {
    process.exit(-1);
  }
  del(['dist', paths.buildDir + '*' + '.js']);
});

gulp.task('concat', function() {
  if (!config.concat.enabled) {
    console.log("skip");
    return;
  }
  return gulp.src(config.concat.order)
    .pipe($.plumber())
    .pipe($.concat(paths.tmpfile + '.js'))
    .pipe(gulp.dest(paths.buildDir));
});

gulp.task('expand', ['concat'], function() {
  if (!config.expand.enabled) {
    console.log("skip");
    return;
  }
  var tmp = gulp.src(paths.buildDir + paths.tmpfile + '.js');
  var val, mod;
  for (k in vars) {
    val = config.expand.prefix + k + config.expand.suffix;
    mod = vars[k];
    tmp.pipe($.replace(val, mod));
  }
  return tmp.pipe($.rename(config.outputName + '.js'))
    .pipe(gulp.dest(paths.buildDir));
});

gulp.task('beauty', function() {
  if (!config.beautifier.enabled) {
    console.log("skip");
    return;
  }
  return gulp.src(paths.buildDir + config.outputName + '.js')
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
  del(['dist', paths.buildDir + paths.tmpfile + '*' + '.js']);
  return gulp.src(paths.buildDir + config.outputName + '.js')
    .pipe($.plumber())
    .pipe($.uglify())
    .pipe($.rename(config.outputName + '.min' + '.js'))
    .pipe(gulp.dest(paths.buildDir));
});

gulp.task('jshint', function() {
  if (!config.jshint.enabled) {
    console.log("skip");
    return;
  }
  return gulp.src(paths.buildDir + config.outputName + '.js')
    .pipe($.plumber())
    .pipe($.jshint(config.jshint.rcfile))
    .pipe($.jshint.reporter('jshint-stylish'));
});

gulp.task('mochaTest', function() {
  if (!config.mochaTest.enabled) {
    console.log("skip");
    return;
  }
  return gulp.src([paths.testDir + '*' + '.js'], {
    read: false
  }).pipe($.mocha());
});

gulp.task('jsdoc3', function(cb) {
  if (!config.jsdoc3.enabled) {
    console.log("skip");
    return gulp.src('./');
  } else {
    gulp.src(['README.md', paths.buildDir + '*' + '.js'], {
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
    files : [paths.examplesDir + '*', paths.buildDir + '*' + '.js'],
	ui: {
      port : config.browserSync.ui.port
    }
  });
});

gulp.task('bs-reload', function() {
  browserSync.reload();
});
