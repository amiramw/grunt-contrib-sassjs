'use strict';

var grunt = require('grunt');

function readFile(file) {
	var contents = grunt.file.read(file);
	return process.platform === 'win32' ? contents.replace(/\r\n/g, '\n') : contents;
}

exports.sass = {
	compileScss: function (test) {
		test.equal(readFile('test/tmp/scss/banner.css'), readFile('test/expected/banner.css'), 'banner should compile SCSS to CSS');
		test.equal(readFile('test/tmp/scss/compile.css'), readFile('test/expected/compile.css'), 'compile should compile SCSS to CSS');
		test.equal(readFile('test/tmp/scss/imported.css'), readFile('test/expected/imported.css'), 'imported should compile SCSS to CSS');

		test.done();
	},
	compileSass: function (test) {
		test.equal(readFile('test/tmp/sass/banner.css'), readFile('test/expected/banner.css'), 'banner should compile SCSS to CSS');
		test.equal(readFile('test/tmp/sass/compile.css'), readFile('test/expected/compile.css'), 'compile should compile SCSS to CSS');
		test.equal(readFile('test/tmp/sass/imported.css'), readFile('test/expected/imported.css'), 'imported should compile SCSS to CSS');

		test.done();
	},
	ignorePartials: function (test) {
		test.ok(!grunt.file.exists('test/tmp/_partial.css'), 'underscore partial files should be ignored');
		test.done();
	}
};
