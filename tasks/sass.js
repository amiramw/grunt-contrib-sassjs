'use strict';

var Sass = require('sass.js');
var fs = require('fs');
var _ = require('lodash');
var Q = require('q');
var path = require('path');
var mkdirp = require('mkdirp');

Sass.options({
  style: Sass.style.expanded
});

module.exports = function (grunt) {
  grunt.registerMultiTask('sass', 'Compile Sass to CSS', function () {

    var done = this.async();
    var data = this.data;

    var baseDir = data.appDir;
    var targetDir = data.target || baseDir;

    function _computeFolderFilesList(stylesDir) {
      return fs.readdirSync(baseDir + stylesDir).filter(function (file) {
        return file.endsWith(".scss")
      }).map(function (file) {
        return stylesDir + file.replace(/\.scss$/, "");
      });
    }

    var allSassFiles = _.flatten(data.folders.map(_computeFolderFilesList)).map(function (file) {
      return baseDir + file + ".scss";
    });
    var nonPartials = allSassFiles.filter(function (file) {
      return _.last(file.split("/"))[0] !== "_";
    });
    allSassFiles.forEach(function (file) {
      Sass.writeFile(file, fs.readFileSync(file, 'utf8'));
    });

    Q.all(nonPartials.map(function (file) {
      var deferred = Q.defer();
      var targetFilePref = targetDir + file;
      mkdirp(path.dirname(targetFilePref), function (err) {
        if (err) {
          console.error("Sass - error occurred while creating folder: " + err);
          deferred.reject();
        } else {
          Sass.compile("@import \"" + file + "\"", function (result) {
            try {
              var cssFileName = targetFilePref + ".css";
              console.log("Sass - Writing file " + cssFileName);
              var content = result.text;
              console.log("Compiled css: " + content.length + " characters");
              fs.writeFileSync(cssFileName, content, 'utf8');
              var cssMapFileName = targetFilePref + ".css.map";
              console.log("Sass - Writing file " + cssMapFileName);
              fs.writeFileSync(cssMapFileName, JSON.stringify({
                version: result.map.version,
                mappings: result.map.mappings,
                sources: result.map.sources.filter(function (source) {
                  return source !== "stdin"
                }),
                names: result.map.names,
                file: _.last(targetFilePref.split("/"))
              }), 'utf8');
              console.log("Sass - Done writing files for " + targetFilePref);
            } catch (err) {
              console.error("Sass - error occurred: " + err);
              deferred.reject();
            }
            deferred.resolve();
          })
        }
      });
      return deferred.promise;
    })).then(function () {
      console.log("Done sass compilation");
      done();
    }).done();
  });
};
