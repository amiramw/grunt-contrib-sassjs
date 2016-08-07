# grunt-contrib-sassjs 
[![Build Status](https://travis-ci.org/amiramw/grunt-contrib-sassjs.svg?branch=master)](https://travis-ci.org/amiramw/grunt-contrib-sassjs)
[![npm version](https://badge.fury.io/js/grunt-contrib-sassjs.svg)](http://badge.fury.io/js/grunt-contrib-sassjs)

> Compile Sass to CSS using [sass.js](https://github.com/medialize/sass.js)

This task uses sass.js, which is a Sass compiler written in JavaScript. It's not as fast as the C implementation [node-sass](https://github.com/andrew/node-sass) but it is completely stand alone and doesn't require downloading binaries or installing anything.


## Install

```
$ npm install --save-dev grunt-contrib-sassjs
```


## Usage

```js
grunt.initConfig({
	sass: {
		dist: {
			files: {
				'main.css': 'main.scss'
			}
		}
	}
});

grunt.registerTask('default', ['sass']);
```

Files starting with `_` are ignored to match the expected [Sass partial behaviour](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#partials).


## Options

See the `sass.js` [options](https://github.com/sass/node-sass#options).

## License

MIT
