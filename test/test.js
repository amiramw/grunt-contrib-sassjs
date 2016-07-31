'use strict';

var grunt = require('grunt');

function readFile(file) {
  var contents = grunt.file.read(file);
  if (process.platform === 'win32') {
    contents = contents.replace(/\r\n/g, '\n');
  }
  return contents;
}

exports.sass = {
  compile: function (test) {
    test.equal(readFile('test/tmp/fixtures/banner.css'), readFile('test/fixtures/banner.css'), 'banner should compile SCSS to CSS');
    test.equal(readFile('test/tmp/fixtures/compile.css'), readFile('test/fixtures/compile.css'), 'compile should compile SCSS to CSS');
    test.equal(readFile('test/tmp/fixtures/imported.css'), readFile('test/fixtures/imported.css'), 'imported should compile SCSS to CSS');

    test.ok(!grunt.file.exists('test/tmp/_partial.css'), 'underscore partial files should be ignored');

    test.done();
  }
};
