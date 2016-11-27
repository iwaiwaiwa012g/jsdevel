jsdevel
====

Make be easily the native development with javascript.

## Description
The following tasks will be executed by `gulp` command only,will make be easily the native development with javascript.
These all tasks don't change original files in `src` directory, but make new compiled file in `build` directory. This way is safety.

## Default gulp tasks
1. __CODE CONCAT__ : using [gulp-concat](https://www.npmjs.com/package/gulp-concat)
2. __EXPAND VARIABLES__ : using [gulp-replace](https://www.npmjs.com/package/gulp-replace)
3. __CODE BEAUTIFIER__ : using [gulp-jsbeautifier](https://www.npmjs.com/package/gulp-jsbeautify) , [gulp-convert-encoding](https://www.npmjs.com/package/gulp-convert-encoding)
4. __CODE MINIFY__ : using [gulp-uglify](https://www.npmjs.com/package/gulp-uglify)
5. __CODE CHECK__ : using [gulp-jshint](https://www.npmjs.com/package/gulp-jshint)
6. __FUNCTIONAL TEST__ : using [gulp-mocha](https://www.npmjs.com/package/gulp-mocha)
7. __FUNCTIONAL DOCS__ : using [gulp-jsdoc3](https://www.npmjs.com/package/gulp-jsdoc3)
8. __MULTI BROWSER SYNCHRONIZE START__ : using [browser-sync](https://www.npmjs.com/package/browser-sync)

## Install
1. `sudo yum install nodejs`
2. `git clone https://github.com/MichinaoShimizu/jsdevel.git && cd jsdevel`
3. `sudo npm i -g gulp`
4. `npm i`

## Usage
1. Make javascript files in `src`.
2. Write variables in `vars`.
3. Change config in `config.json`.
4. `gulp` or `gulp -e prod` or `gulp -e stage`