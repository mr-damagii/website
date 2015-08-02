module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        copy: {
            styles: {
                files: [{
                    cwd: './bower_components/bourbon/app/assets/stylesheets/',
                    expand: true,
                    src: [ '**/*.scss' ],
                    dest: './styles/lib/bourbon/'
                }, {
                    cwd: './bower_components/neat/app/assets/stylesheets/',
                    expand: true,
                    src: [ '**/*.scss' ],
                    dest: './styles/lib/neat/'
                }, {
                    src: './bower_components/normalize.css/normalize.css',
                    dest: './styles/lib/normalize.css/normalize.css'
                }, {
                    src: './bower_components/normalize.css/normalize.css',
                    dest: './client/styles/lib/normalize.css/normalize.css'
                }]
            }
        },
        sass: {
            dev: {
                files: [{
                    expand: true,
                    cwd: 'styles',
                    src: [ '*.scss' ],
                    dest: 'client/styles'
                }]
            }
        },
        watch: {
            styles: {
                files: 'styles/**/*.scss',
                tasks: [ 'sass:dev' ]
            },
            server: {
                files: [ '.rebooted' ],
                tasks: [ 'sass:dev' ]
            }
        },
        'node-inspector': {
            dev: {
                options: {
                    'web-port': 10055,
                    'web-host': 'localhost',
                    hidden: [ 'node_modules' ]
                }
            }
        },
        nodemon: {
            dev: {
                script: 'app.js',
                ignore: [
                    'node_modules/**/*',
                    'bower_components/**/*',
                    '.design/**/*',
                    '.keys/**/*',
                    '.sass-cache/**/*',
                    'test/**/*',
                    '.gitignore',
                    '.gitattributes'
                ],
                ext: 'js,hbs',
                options: {
                    nodeArgs: [
                        '--harmony',
                        '--debug'
                    ],
                    logConcurrentOutput: true,
                    callback: function (nodemon) {
                        nodemon.on('config:update', function () {
                            setTimeout(function () {
                                require('open')('http://localhost:10054');
                            }, 1000);
                        });

                        nodemon.on('restart', function () {
                            setTimeout(function () {
                                require('fs').writeFileSync('.rebooted', 'rebooted');
                            }, 1000);
                        });
                    }
                }
            }
        },
        browserSync: {
            bsFiles: {
                src: [
                    'client/**/*',
                    '.rebooted'
                ]
            },
            options: {
                watchTask: true,
                files: 'styles/**/*.scss',
                tasks: [ 'sass' ]
            }
        },
        concurrent: {
            server: {
                tasks: [
                    'node-inspector',
                    'watch:server',
                    'watch:styles',
                    'nodemon:dev'
                ],
                options: {
                    logConcurrentOutput: true
                }
            }
        }
    });

    grunt.registerTask('default', [
        'copy:styles',
        'sass:dev',
        'browserSync',
        'concurrent'
    ]);

    grunt.registerTask('test', [
        'mochaTest'
    ]);

    grunt.registerTask('prod', [
        'concurrent:prod'
    ]);
};