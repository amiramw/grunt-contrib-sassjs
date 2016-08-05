'use strict';

var Sass = require('sass.js');
var fs = require('fs');
var Q = require('q');

Sass.options({
	style: Sass.style.expanded
});

module.exports = function (grunt) {
	grunt.registerMultiTask('sass', 'Compile Sass to CSS', function () {
		var files = this.files;
		var options = this.options();
		var done = this.async();

		Q.all(files.map(function (file) {
			var deferred = Q.defer();
			var src = file.src[0];
			Sass.writeFile(src, fs.readFileSync(src, 'utf8'));
			if (src[src.lastIndexOf("/")+1] !== '_') {
				Sass.compileFile(src, function (result) {
					try {
						var cssFileName = file.dest;
						grunt.verbose.writeln("Sass - Writing file " + cssFileName);
						var content = result.text;
						grunt.verbose.writeln("Compiled css: " + content.length + " characters");
						grunt.file.write(cssFileName, content);
						if (options.sourceMap && result.map) {
							grunt.verbose.writeln("Sass - Writing file " + options.sourceMap);
							grunt.file.write(options.sourceMap, result.map);
						}
					} catch (err) {
						grunt.log.error("Sass - error occurred: " + err);
						deferred.reject();
					}
					deferred.resolve();
				});
				return deferred.promise;
			}
		})).then(function () {
			grunt.verbose.writeln("Done sass compilation");
			done();
		}).done();
	});
};
