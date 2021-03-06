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
			compileScssWithImport: {
				files: {
					'test/tmp/scss/banner.css': 'test/scss/banner.scss',
					'test/tmp/scss/compile.css': 'test/scss/compile.scss'
				}
			},
			compileSass: {
				files: {
					'test/tmp/sass/banner.css': 'test/sass/banner.sass',
					'test/tmp/sass/compile.css': 'test/sass/compile.sass',
					'test/tmp/sass/imported.css': 'test/sass/imported.sass'
				}
			},
			withPartial: {
				sourceMap: true,
				files: {
					'test/tmp/scss/withpartial.css': 'test/scss/withpartial.scss'
				}
			},
			ignorePartials: {
				cwd: 'test/scss/partials',
				src: '*.scss',
				dest: 'test/tmp',
				expand: true,
				ext: '.css'
			},
			sourceMap: {
				sourceMap: true,
				files: {
					'test/tmp/source-map.css': 'test/scss/sourcemap.scss'
				}
			},
			precision: {
				options: {
					precision: 3
				},
				files: {
					'test/tmp/precision.css': 'test/scss/precision.scss'
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
