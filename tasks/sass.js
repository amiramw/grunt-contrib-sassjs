'use strict';

var Sass = require('sass.js');
var fs = require('fs');
var Q = require('q');


function fullPathToFileName(fullPath) {
	return fullPath.split("/").reverse()[0];
}

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
				Sass.compileFile(src, options, function (result) {
					try {
						var cssFullPath = file.dest;
						var content = result.text;
						if (options.sourceMap && result.map) {
							var cssFile = fullPathToFileName(cssFullPath);
							content = "/*# sourceMappingURL=" + fullPathToFileName(options.sourceMap) + " */\n" + content;
							grunt.file.write(options.sourceMap, JSON.stringify({
								version: result.map.version,
								mappings: result.map.mappings,
								sources: result.map.sources.filter(function (source) {
									return source !== "stdin";
								}),
								names: result.map.names,
								file: cssFile
							}));
						}
						grunt.file.write(cssFullPath, content);
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
