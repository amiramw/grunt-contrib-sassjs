'use strict';
module.exports = function (grunt) {
	grunt.initConfig({
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			all: [
				'Gruntfile.js',
				'tasks/**/*.js',
				'<%= nodeunit.tests %>'
			]
		},
		clean: {
			test: [
				'test/tmp'
			]
		},
		nodeunit: {
			tests: ['test/test.js']
		},
		sass: {
			compile: {
				files: {
					'test/tmp/fixtures/banner.css': 'test/fixtures/banner.scss',
					'test/tmp/fixtures/compile.css': 'test/fixtures/compile.scss',
					'test/tmp/fixtures/imported.css': 'test/fixtures/imported.scss'
				}
			}
		}
	});

	grunt.loadTasks('tasks');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');
	grunt.loadNpmTasks('grunt-contrib-internal');

	grunt.registerTask('test', [
		'clean',
		'jshint',
		'sass',
		'nodeunit',
		'clean'
	]);
	grunt.registerTask('default', ['test', 'contrib-core', 'contrib-ci:skipIfExists']);
};
