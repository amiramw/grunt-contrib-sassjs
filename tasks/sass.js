'use strict';

var Sass = require('sass.js');
var Q = require('q');
var PATH = require('path');

Sass.options({
	style: Sass.style.expanded
});
module.exports = function (grunt) {
	Sass.importer(function (request, done) {
		if (request.path) {
			done();
		} else if (request.resolved) {
			var realPath = request.resolved.replace(/^\/sass\//, "");
			done(Sass.getPathVariations(realPath).reduce(function (found, path) {
				if (found) {
					return found;
				}
				if (grunt.file.exists(path) && !grunt.file.isDir(path)) {
					return {
						path: request.resolved.substr(0, request.resolved.lastIndexOf('/') + 1) + PATH.basename(path),
						content: grunt.file.read(path)
					};
				}
				return null;
			}, null));
		} else {
			done();
		}
	});
	grunt.registerMultiTask('sass', 'Compile Sass to CSS', function () {
		var files = this.files, data = this.data, done = this.async();

		Sass.options(this.options());

		Q.all(files.map(function (file) {
			var deferred = Q.defer();
			var src = file.src[0];
			Sass.writeFile(src, grunt.file.read(src));
			if (PATH.basename(src)[0] !== '_') {
				Sass.compileFile(src, function (result) {
					if  (result.status !== 0) {
						grunt.log.error(result.formatted + '\n');
						grunt.warn('');
						deferred.reject();
					} else {
						try {
							var cssFullPath = file.dest;
							var content = result.text;
							if (data.sourceMap && result.map) {
								var cssFile = PATH.basename(cssFullPath);
								content = "/*# sourceMappingURL=" + cssFile + ".map */\n" + content;
								var rootDirectory = "sass/" + PATH.dirname(src);
								result.map.file = cssFile;
								result.map.sources = result.map.sources.map(function (source) {
									return PATH.relative(rootDirectory, source).replace(/\\/g, "/");
								});
								grunt.file.write(cssFullPath + ".map", JSON.stringify(result.map));
							}
							grunt.file.write(cssFullPath, content);
						} catch (err) {
							grunt.log.error("Sass - error occurred: " + err);
							deferred.reject();
						}
						deferred.resolve();
					}
				});
				return deferred.promise;
			}
		})).then(function () {
			grunt.verbose.writeln("Done sass compilation");
			done();
		}).done();
	});
};
