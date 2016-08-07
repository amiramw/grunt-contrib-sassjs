'use strict';

var Sass = require('sass.js');
var Q = require('q');


function fullPathToFileName(fullPath) {
	return fullPath.split("/").reverse()[0];
}

Sass.options({
	style: Sass.style.expanded
});
module.exports = function (grunt) {
	Sass.importer(function(request, done) {
		if (request.path) {
			done();
		} else if (request.resolved) {
			var realPath = request.resolved.replace(/^\/sass\//, "");
			if (grunt.file.exists(realPath)) {
				done({
					content: grunt.file.read(realPath)
				});
			} else {
				var pathParts = realPath.split("/");
				var fileName = pathParts.pop();
				var pathWithSuffix = pathParts.concat(fileName + ".scss").join("/");
				if (grunt.file.exists(pathWithSuffix)) {
					done({
						content: grunt.file.read(pathWithSuffix)
					});
				} else {
					var partialPath = pathParts.concat("_" + fileName + ".scss").join("/");
					done({
						content: grunt.file.read(partialPath)
					});
				}
			}
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
			if (src[src.lastIndexOf("/")+1] !== '_') {
				Sass.compileFile(src, function (result) {
					try {
						var cssFullPath = file.dest;
						var content = result.text;
						if (data.sourceMap && result.map) {
							var cssFile = fullPathToFileName(cssFullPath);
							content = "/*# sourceMappingURL=" + fullPathToFileName(data.sourceMap) + " */\n" + content;
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
				});
				return deferred.promise;
			}
		})).then(function () {
			grunt.verbose.writeln("Done sass compilation");
			done();
		}).done();
	});
};
