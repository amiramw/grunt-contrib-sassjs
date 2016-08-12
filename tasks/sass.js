'use strict';

var Sass = require('sass.js');
var Q = require('q');
var PATH = require('path');

// copied from https://github.com/medialize/sass.js/blob/master/src/sass.importer.js#L61-L82
// should consider expose and reuse
function _pathVariations(path) {
	// [importer,include_path] this is where we would add the ability to
	// examine the include_path (if we ever use that in Sass.js)
	path = PATH.normalize(path);
	var directory = PATH.dirname(path);
	var basename = PATH.basename(path);
	var extensions = ['.scss', '.sass', '.css'];
	// basically what is done by resolve_and_load() in file.cpp
	// Resolution order for ambiguous imports:
	return [
		// (1) filename as given
		path,
		// (2) underscore + given
		PATH.resolve(directory, '_' + basename)
	].concat(extensions.map(function (extension) {
		// (3) underscore + given + extension
		return PATH.resolve(directory, '_' + basename + extension);
	})).concat(extensions.map(function (extension) {
		// (4) given + extension
		return PATH.resolve(directory, basename + extension);
	}));
}

Sass.options({
	style: Sass.style.expanded
});
module.exports = function (grunt) {
	Sass.importer(function (request, done) {
		if (request.path) {
			done();
		} else if (request.resolved) {
			var realPath = request.resolved.replace(/^\/sass\//, "");
			done(_pathVariations(realPath).reduce(function (found, path) {
				if (found) {
					return found;
				}
				if (grunt.file.exists(path)) {
					return {
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
								content = "/*# sourceMappingURL=" + PATH.basename(data.sourceMap) + " */\n" + content;
								grunt.file.write(data.sourceMap, JSON.stringify({
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
