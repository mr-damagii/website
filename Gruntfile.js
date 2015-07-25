module.exports = function(grunt) {
    grunt.initConfig({
        copy: {
            dev: {
                files: [
                    {
                        cwd: './bower_components/bourbon/app/assets/stylesheets/',
                        expand: true,
                        src: ['**/*.scss'],
                        dest: './styles/lib/bourbon/'
                    },
                    {
                        cwd: './bower_components/neat/app/assets/stylesheets/',
                        expand: true,
                        src: ['**/*.scss'],
                        dest: './styles/lib/neat/'
                    },
                    {
                        src: './bower_components/normalize.css/normalize.css',
                        dest: './styles/lib/normalize.css/normalize.css'
                    },
                    {
                        src: './bower_components/normalize.css/normalize.css',
                        dest: './client/styles/lib/normalize.css/normalize.css'
                    }
                ]
            }
        },
        sass: {
            dev: {
                files: {
                    './client/styles/styles.css': './styles/styles.scss'
                }
            }
        },
        mochaTest: {
            dev: {
                src: [
                    'test/**/*.test.js'
                ]
            }
        },
        "file-creator": {
            dev: {
                './.restart': function(fs, fd, done) {
                    fs.writeSync(fd, '');
                    done();
                }
            }
        },
        nodemon: {
            dev: {
                script: 'app.js',
                options: {
                    nodeArgs: ['--harmony'],
                    watch: [
                        'app.js',
                        './.restart'
                    ]
                }
            },
            admin: {
                script: 'admin.js',
                options: {
                    nodeArgs: ['--harmony'],
                    watch: [
                        'admin.js'
                    ]
                }
            },
            prod: {
                script: 'app.js',
                options: {
                    nodeArgs: ['--harmony']
                }
            }
        },
        watch: {
            styles: {
                files: [
                    './styles/**/*.scss', 
                    './styles/**/*.sass', 
                    './styles/**/*.css'
                ],
                tasks: [
                    'sass'
                ]
            },
            server: {
                files: [
                    './views/**/*',
                    './app.js'
                ],
                tasks: [
                    'file-creator'
                ]
            }
        },
        browserSync: {
            bsFiles: {
                src : [
                    './client/**/*',
                    './.restart'
                ]
            },
            options: {
                watchTask: true
            }
        },
        concurrent: {
            dev: [
                'nodemon:dev',
                'nodemon:admin',
                'watch'
            ],
            prod: [
                'nodemon:prod'
            ],
            options: {
                logConcurrentOutput: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-file-creator');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.registerTask('default', [
        'copy',
        'sass',
        'browserSync',
        'concurrent:dev'
    ]);

    grunt.registerTask('test', [
        'mochaTest'
    ]);

    grunt.registerTask('prod', [
        'concurrent:prod'
    ]);
};