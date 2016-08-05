# grunt-sass [![Build Status](https://travis-ci.org/amiramw/grunt-contrib-sassjs.svg?branch=master)](https://travis-ci.org/amiramw/grunt-contrib-sassjs)

> Compile Sass to CSS using [sass.js](https://github.com/medialize/sass.js)

This task uses sass.js, which is a Sass compiler in JavaScript. It's not as fast as the C implementation [https://github.com/andrew/node-sass](node-sass) but it is completely stand alone and run on JavaScript only.


## Install

```
$ npm install --save-dev grunt-contrib-sassjs
```


## Usage

```js
grunt.initConfig({
	sass: {
		options: {
			sourceMap: true
		},
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
