module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        dirs: {
            bower: 'bower_components/',
            npm: 'node_modules/',
            sass: '.sass-cache/',
            keys: '.keys/',
            designs: '.design/',
            reboot: 'build/.reboot',
            build: {
                base: 'build/',
                pub: 'build/public/',
                styles: 'build/styles/'
            },
            docs: 'docs/',
            src: {
                base: 'src/',
                styles: 'src/styles/'
            },
            tests: 'test/',
            tools: 'tools/',
            usr: 'usr/'
        },
        clean: {
            build: {
                src: [ '<%= dirs.build.base %>**/*' ]
            }
        },
        copy: {
            build: {
                files: [{
                    cwd: '<%= dirs.src.base %>',
                    expand: true,
                    src: [ '**/*' ],
                    dest: '<%= dirs.build.base %>'
                }, {
                    src: '<%= dirs.bower %>normalize.css/normalize.css',
                    dest: '<%= dirs.build.styles %>normalize.css/normalize.css'
                }]
            }
        },
        sass: {
            build: {
                options: {
                    style: 'expanded',
                    loadPath: [
                        '<%= dirs.src.styles %>',
                        '<%= dirs.bower %>',
                        '<%= dirs.npm %>'
                    ]
                },
                files: [{
                    expand: true,
                    cwd: '<%= dirs.src.styles %>',
                    src: [
                        '*.scss',
                        '*.sass'
                    ],
                    dest: '<%= dirs.build.styles %>',
                    ext: '.css'
                }]
            }
        },
        mochaTest: {
            build: {
                src: [
                    '<%= dirs.tests %>**/*-test.js'
                ]
            }
        }
    });

    grunt.registerTask('build', [
        'copy:build',
        'sass:build'
    ]);

    grunt.registerTask('clear', [
        'clean:build'
    ]);

    grunt.registerTask('rebuild', [
        'clean:build',
        'copy:build',
        'sass:build'
    ]);

    grunt.registerTask('release', [
        'clean:build',
        'copy:build',
        'sass:build'
    ]);

    grunt.registerTask('test', [
        'mochaTest:build'
    ]);
};