'use strict';

var grunt = require('grunt');

function readFile(file) {
	var contents = grunt.file.read(file);
	return process.platform === 'win32' ? contents.replace(/\r\n/g, '\n') : contents;
}

exports.sass = {
	compileScssWithImport: function (test) {
		test.equal(readFile('test/tmp/scss/banner.css'), readFile('test/expected/banner.css'), 'banner should compile SCSS to CSS');
		test.equal(readFile('test/tmp/scss/compile.css'), readFile('test/expected/compile.css'), 'compile should compile SCSS to CSS');

		test.done();
	},
	compileSass: function (test) {
		test.equal(readFile('test/tmp/sass/banner.css'), readFile('test/expected/banner.css'), 'banner should compile SCSS to CSS');
		test.equal(readFile('test/tmp/sass/compile.css'), readFile('test/expected/compile.css'), 'compile should compile SCSS to CSS');
		test.equal(readFile('test/tmp/sass/imported.css'), readFile('test/expected/imported.css'), 'imported should compile SCSS to CSS');

		test.done();
	},
	withPartial: function (test) {
		test.equal(readFile('test/tmp/scss/withpartial.css'), readFile('test/expected/withpartial.css'), 'withpartial should be as expected');

		test.done();
	},
	ignorePartials: function (test) {
		test.ok(!grunt.file.exists('test/tmp/_partial.css'), 'underscore partial files should be ignored');
		test.done();
	},
	sourceMap: function (test) {
		var css = grunt.file.read('test/tmp/source-map.css');
		test.ok(/\/\*# sourceMappingURL=source\-map\.css\.map/.test(css), 'should include sourceMapppingUrl');
		var map = grunt.file.read('test/tmp/source-map.css.map');
		test.ok(/sourcemap\.scss/.test(map), 'should include the main file in sourceMap at least');

		test.done();
	},
	precision: function (test) {
		var actual = grunt.file.read('test/tmp/precision.css');
		test.ok(/1\.343/.test(actual), 'should support precision option');

		test.done();
	}
};
