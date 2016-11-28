jsdevel
====

The structure to simplify the development with native javascript.

## Description
Once you checked out this project, you can place your own source code to `src` folder, then you can use the following set of tasks.
These all tasks don't change original files in `src`, and new compiled files will be generated in `dest`. 

### Tasks
1. __CODE CONCAT__ : using [gulp-concat](https://www.npmjs.com/package/gulp-concat)
2. __EXPAND VARIABLES__ : using [gulp-replace](https://www.npmjs.com/package/gulp-replace)
3. __CODE BEAUTIFIER__ : using [gulp-jsbeautifier](https://www.npmjs.com/package/gulp-jsbeautify) , [gulp-convert-encoding](https://www.npmjs.com/package/gulp-convert-encoding)
4. __CODE CHECK__ : using [gulp-jshint](https://www.npmjs.com/package/gulp-jshint)
5. __CODE MINIFY__ : using [gulp-uglify](https://www.npmjs.com/package/gulp-uglify)
6. __FUNCTIONAL TEST__ : using [gulp-mocha](https://www.npmjs.com/package/gulp-mocha)
7. __GENERATE DOCS__ : using [gulp-jsdoc3](https://www.npmjs.com/package/gulp-jsdoc3)
8. __START BROWSER SYNC__ : using [browser-sync](https://www.npmjs.com/package/browser-sync)

## Requirement
* [node.js](https://nodejs.org/)

## Installation
```
$ yum install nodejs
$ git clone https://github.com/MichinaoShimizu/jsdevel.git
$ cd jsdevel
$ npm i -g gulp
$ npm i
```

## Build settings
Build settings can be controlled in [config.yml](https://github.com/MichinaoShimizu/jsdevel/blob/master/config.yml). You can enable or disable each task with `enabled` parameter in each section. For details, see comments in each section.

## Usage
1. Make javascript files in `src`.
2. Write variables in `vars/dev.yml`.
3. Set config in `config.yml`　you like to.
4. `gulp` or `gulp -e prod` or `gulp -e stage`

## Trouble shooting

### Can't access the server url when browserSync > enabled is set to true.

Check firewalld in your server.

```
$ firewall-cmd --list-ports --zone=public
```

If the port number you set in the config.yml is not shown, you might want to open the port with the command like the following.

```
$ firewall-cmd --add-port=【config.browserSync.port】/tcp --zone=public --permanent
$ firewall-cmd --add-port=【config.browserSync.ui.port】/tcp --zone=public --permanent
$ firewall-cmd --reload
```

