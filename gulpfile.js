const gulp = require("gulp");
const runSequence = require('run-sequence');
const process = require("process");
const minimist = require("minimist");
const jsdoc = require('gulp-jsdoc3');
const prettify = require('gulp-jsbeautifier');
const $ = require('gulp-load-plugins')();
const del = require("del");
const browserSync = require('browser-sync');
const fs = require("fs");
const path = require("path");
const configFile = './config.json';
const config = require(configFile);
const varsDir = './vars/';
const srcDir = './src/';
const buildDir = './build/';
const docsDir = './docs/gen/';
const testDir = './tests/';
const examplesDir = './examples/';
const envTypes = ['prod', 'dev', 'stage'];
const extJs = '.js';
const extJson = '.json';
const extMin = '.min';
const astarisk = '*';
const tmpfile = 'tmpfilename';

var argv = minimist(process.argv.slice(2));
var vars, env;

gulp.task('default', function(callback) {
  return runSequence('config', 'concat', 'expand', 'beauty', 'minify', 'jshint', 'mochaTest', 'jsdoc3', 'browserSync'/*, 'filelist'*/, terminate);
});

gulp.task('config', function() {
  if (envTypes.indexOf(argv['e']) < 0) {
    env = 'dev';
  } else {
    env = argv['e'];
  }
  vars = require(varsDir + env + extJson);
  if (!vars) {
    console.log("nothing configv/vars/" + env + extJson);
    process.exit(-1);
  }
  del(['dist', buildDir + astarisk + extJs]);
});

gulp.task('concat', function() {
  if (!config.concat.enabled) {
    console.log("skip");
    return;
  }
  return gulp.src(config.concat.order)
    .pipe($.plumber())
    .pipe($.concat(tmpfile + extJs))
    .pipe(gulp.dest(buildDir));
});

gulp.task('expand', ['concat'], function() {
  if (!config.expand.enabled) {
    console.log("skip");
    return;
  }
  var tmp = gulp.src(buildDir + tmpfile + extJs);
  var val, mod;
  for (k in vars) {
    val = config.expand.prefix + k + config.expand.suffix;
    mod = vars[k];
    tmp.pipe($.replace(val, mod));
  }
  return tmp.pipe($.rename(config.outputName + extJs)).pipe(gulp.dest(buildDir));
});

gulp.task('beauty', function() {
  if (!config.beautifier.enabled) {
    console.log("skip");
    return;
  }
  var src = gulp.src(buildDir + config.outputName + extJs);
//  var src = gulp.src("./*.js");
  src.pipe($.plumber())
    .pipe(prettify({
      'indent_char': config.beautifier.indentChar,
      'indent_size': config.beautifier.indentSize,
      'eol': config.beautifier.eol,
      'end_with_newline': config.beautifier.endWithNewline
    }))
    .pipe($.convertEncoding({
      to: config.beautifier.convertEncoding
    }))
    .pipe($.diff())
    .pipe($.diff.reporter())
    .pipe(gulp.dest(buildDir));
});

gulp.task('minify', function() {
  if (!config.minify.enabled) {
    console.log("skip");
    return;
  }
  del(['dist', buildDir + tmpfile + astarisk + extJs]);
  return gulp.src(buildDir + config.outputName + extJs)
    .pipe($.plumber())
    .pipe($.uglify())
    .pipe($.rename(config.outputName + extMin + extJs))
    .pipe(gulp.dest(buildDir));
});

gulp.task('jshint', function() {
  if (!config.jshint.enabled) {
    console.log("skip");
    return;
  }
  return gulp.src(buildDir + config.outputName + extJs)
    .pipe($.plumber())
    .pipe($.jshint(config.jshint.rcfile))
    .pipe($.jshint.reporter('jshint-stylish'));
});

gulp.task('mochaTest', function() {
  if (!config.mochaTest.enabled) {
    console.log("skip");
    return;
  }
  return gulp.src([testDir + astarisk + extJs], {
    read: false
  }).pipe($.mocha());
});

gulp.task('jsdoc3', function(cb) {
  if (!config.jsdoc3.enabled) {
    console.log("skip");
  } else {
    gulp.src(['README.md', buildDir + astarisk + extJs], {
      read: false
    }).pipe(jsdoc(cb));
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
    files : [examplesDir + astarisk, buildDir + astarisk + extJs],
	ui: {
      port : config.browserSync.ui.port
    }
  });
});

gulp.task('bs-reload', function() {
  browserSync.reload();
});

/*
gulp.task('filelist', function() {
  if (!config.browserSync.enabled) {
    console.log("skip");
    return;
  }
  fs.writeFile(config.browserSync.server.indexFile, '', function(err) {});
  walk('src', function(path) {
    appendIndexFile(path);
  });
  walk('vars', function(path) {
    appendIndexFile(path);
  });
  walk('build', function(path) {
    appendIndexFile(path);
  });
  walk('examples', function(path) {
    appendIndexFile(path);
  });
  appendIndexFile('docs/gen');
  //walk('docs/gen', function(path) {appendIndexFile(path);});
});

function walk(p, fileCallback, errCallback) {
  fs.readdir(p, function(err, files) {
    if (err) {
      errCallback(err);
      return;
    }
    files.forEach(function(f) {
      var fp = path.join(p, f);
      if (fs.statSync(fp).isDirectory()) {
        walk(fp, fileCallback);
      } else {
        fileCallback(fp);
      }
    });
  });
};

function appendIndexFile(path) {
  fs.appendFile(config.browserSync.server.indexFile, '<li><a href="' + path + '">' + path + '</a></li>', function(err) {});
}
*/
function terminate() {
  del(['dist', buildDir + tmpfile + astarisk + extJs]);
  watchTasks();
  return;
}

function watchTasks() {
  gulp.watch([srcDir + astarisk + extJs, configFile, varsDir + astarisk + extJson], function() {
    return runSequence('concat', 'expand', 'beauty', 'minify', 'jshint', 'mochaTest', 'jsdoc3');
  });
  gulp.watch([buildDir + config.outputName + extJs, examplesDir + astarisk], ['bs-reload'/*, 'filelist'*/]);
}
