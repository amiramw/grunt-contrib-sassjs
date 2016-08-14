'use strict';

var grunt = require('grunt');

exports.sass = {
	compileScssWithImport: function (test) {
		test.equal(grunt.file.read('test/tmp/scss/banner.css'), grunt.file.read('test/expected/banner.css'), 'banner should compile SCSS to CSS');
		test.equal(grunt.file.read('test/tmp/scss/compile.css'), grunt.file.read('test/expected/compile.css'), 'compile should compile SCSS to CSS');
		test.done();
	},
	compileSass: function (test) {
		test.equal(grunt.file.read('test/tmp/sass/banner.css'), grunt.file.read('test/expected/banner.css'), 'banner should compile SCSS to CSS');
		test.equal(grunt.file.read('test/tmp/sass/compile.css'), grunt.file.read('test/expected/compile.css'), 'compile should compile SCSS to CSS');
		test.equal(grunt.file.read('test/tmp/sass/imported.css'), grunt.file.read('test/expected/imported.css'), 'imported should compile SCSS to CSS');
		test.done();
	},
	withPartial: function (test) {
		test.equal(grunt.file.read('test/tmp/scss/withpartial.css'), grunt.file.read('test/expected/withpartial.css'), 'withpartial should be as expected');
		var cssMap = grunt.file.readJSON('test/tmp/scss/withpartial.css.map');
		test.deepEqual(cssMap.sources, ["withpartial.scss","partials/_partial.scss"]);
		test.equal(cssMap.file, "withpartial.css");
		test.ok(cssMap.sourcesContent);
		test.done();
	},
	ignorePartials: function (test) {
		test.ok(!grunt.file.exists('test/tmp/_partial.css'), 'underscore partial files should be ignored');
		test.done();
	},
	sourceMap: function (test) {
		var css = grunt.file.read('test/tmp/source-map.css');
		test.ok(/\/\*# sourceMappingURL=source\-map\.css\.map/.test(css), 'should include sourceMappingUrl');
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
