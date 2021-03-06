jsdevel
====

Make be easily the native development with javascript.

## Description
The following tasks will be executed by `gulp` command only, will make be easily the native development with javascript.
These all tasks don't change original files in `src`, new compiled files will be generated in `dest`. 

### Tasks
1. __CODE CONCAT__ : using [gulp-concat](https://www.npmjs.com/package/gulp-concat)
2. __EXPAND VARIABLES__ : using [gulp-replace](https://www.npmjs.com/package/gulp-replace)
3. __CODE BEAUTIFIER__ : using [gulp-jsbeautifier](https://www.npmjs.com/package/gulp-jsbeautify) , [gulp-convert-encoding](https://www.npmjs.com/package/gulp-convert-encoding)
4. __CODE MINIFY__ : using [gulp-uglify](https://www.npmjs.com/package/gulp-uglify)
5. __CODE CHECK__ : using [gulp-jshint](https://www.npmjs.com/package/gulp-jshint)
6. __FUNCTIONAL TEST__ : using [gulp-mocha](https://www.npmjs.com/package/gulp-mocha)
7. __GENERATE DOCS__ : using [gulp-jsdoc3](https://www.npmjs.com/package/gulp-jsdoc3)
8. __START BROWSER SYNC__ : using [browser-sync](https://www.npmjs.com/package/browser-sync)

## Requirement
* node.js

## Installation
```
$ yum install nodejs
$ git clone https://github.com/MichinaoShimizu/jsdevel.git
$ cd jsdevel
$ npm i -g gulp
$ npm i
```

## Build settings
Build setting can be controlled in [config.yml](https://github.com/MichinaoShimizu/jsdevel/blob/master/config.yml).

### If browserSync is enabeld, but cannot access to server url.
Maybe firewalld block access. Please check and open the port.
```
$ firewall-cmd --list-ports --zone=public
$ firewall-cmd --add-port=【config.browserSync.port】/tcp --zone=public --permanent
$ firewall-cmd --add-port=【config.browserSync.ui.port】/tcp --zone=public --permanent
$ firewall-cmd --reload
```

## Usage
1. Make javascript files in `src`.
2. Write variables in `vars/dev.yml`.
3. Set config in `config.yml`　you like to.
4. `gulp` or `gulp -e prod` or `gulp -e stage`
