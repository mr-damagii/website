var should = require('should');
var rewire = require('rewire');

var path = require('path');

var Project = require('../../models/project');

var getRewiredProjectService = function () {

    return rewire(
        path.join(
            process.cwd(), 
            './services/projectService'));

};

var mockProjectServiceWithDatabaseConnectionError = function () {

    var projectService = getRewiredProjectService();

    projectService.__set__('_openConn', function (cb) {

        cb({}, null, function () {});

    });

    return projectService;

};

var mockProjectServiceWithCollectionOperationError = function () {

    var projectService = getRewiredProjectService();

    projectService.__set__('_openConn', function (cb) {

        cb({}, {

            updateOne: function (f, q, o, c) {

                c({});

            },


            find: function () {

                return {
                    
                    sort: function () {

                        return {

                            skip: function () {

                                return {

                                    limit: function () {

                                        return {

                                            toArray: function (innerCb) {

                                                innerCb({});

                                            }

                                        };
                                        
                                    }

                                };

                            }

                        };

                    },


                    toArray: function (innerCb) {

                        innerCb({});

                    }

                };

            },


            deleteOne: function (q, c) {

                c({});

            }

        }, function () {});

    });

    return projectService;

};

var mockProjectServiceWithUpdateOneSpy = function (updateOneSpy) {

    var projectService = getRewiredProjectService();

    projectService.__set__('_openConn', function (cb) {

        cb(null, {

            updateOne: function (f, q, o, c) {

                updateOneSpy(f, q, o, c);

                c(null);

            }

        }, function () {});

    });

    return projectService;

};

var mockProjectServiceWithFindSpy = function (findSpy) {

    var projectService = getRewiredProjectService();

    projectService.__set__('_openConn', function (cb) {

        cb(null, {

            find: function (q) {

                findSpy(q);

                return {

                    sort: function () {

                        return {

                            skip: function () {

                                return {

                                    limit: function () {

                                        return {

                                            toArray: function (innerCb) {

                                                innerCb(null, []);

                                            }

                                        };
                                        
                                    }

                                };

                            }

                        };

                    },


                    toArray: function (innerCb) {

                        innerCb(null, []);

                    }

                };

            }

        }, function () {});

    });

    return projectService;

};

var mockProjectServiceWithNoFindResult = function () {

    var projectService = getRewiredProjectService();

    projectService.__set__('_openConn', function (cb) {

        cb(null, {

            find: function (q) {

                return {

                    sort: function () {

                        return {

                            skip: function () {

                                return {

                                    limit: function () {

                                        return {

                                            toArray: function (innerCb) {

                                                innerCb(null, []);

                                            }

                                        };
                                        
                                    }

                                };

                            }

                        };

                    },


                    toArray: function (innerCb) {

                        innerCb(null, []);

                    }

                };

            }

        }, function () {});

    });

    return projectService;

};

var mockProjectServiceWithFindResult = function () {

    var projectService = getRewiredProjectService();

    projectService.__set__('_openConn', function (cb) {

        cb(null, {

            find: function (q) {

                return {

                    sort: function () {

                        return {

                            skip: function () {

                                return {

                                    limit: function () {

                                        return {

                                            toArray: function (innerCb) {

                                                innerCb(null, [{

                                                    _id: '507f1f77bcf86cd799439011',
                                                    header: {

                                                        title: 'test',
                                                        summary: 'test',
                                                        thumbnail: 'test',
                                                        largeThumbnail: 'test'

                                                    },
                                                    url: 'test',
                                                    image: 'test',
                                                    largeImage: 'test',
                                                    body: 'test',
                                                    created: Date.now(),
                                                    published: Date.now()

                                                }]);

                                            }

                                        };
                                        
                                    }

                                };

                            }

                        };

                    },


                    toArray: function (innerCb) {

                        innerCb(null, [{

                            _id: '507f1f77bcf86cd799439011',
                            header: {

                                title: 'test',
                                summary: 'test',
                                thumbnail: 'test',
                                largeThumbnail: 'test'

                            },
                            url: 'test',
                            image: 'test',
                            largeImage: 'test',
                            body: 'test',
                            created: Date.now(),
                            published: Date.now()

                        }]);

                    }

                };

            }

        }, function () {});

    });

    return projectService;

};

describe('projectService', function () {

    describe('upsertOne', function () {

        it('should supply an error to the callback if a database exception occurs',
            function (done) {

                var projectService = mockProjectServiceWithDatabaseConnectionError();
                projectService().upsertOne({}, function (err, col, d) {

                    err.should.be.ok;

                    done();

                });

            });

        it('should call updateOne with the upsert option set to true',
            function (done) {

                var calls = 0;
                var projectService = mockProjectServiceWithUpdateOneSpy(function (f, q, o, c) {

                    o.upsert.should.be.true;
                    calls++;

                });

                projectService().upsertOne({ _id: '' }, function (err, col, d) {

                    calls.should.equal(1);
                    
                    done();

                });

            });

        it('should supply an error to the callback if a collection exception occurs',
            function (done) {

                var projectService = mockProjectServiceWithCollectionOperationError();

                projectService().upsertOne({ _id: '' }, function (err) {

                    err.should.be.ok;

                    done();

                });

            });

    });

    describe('getOne', function () {

        it('should supply an error to the callback if a database execption occurs',
            function (done) {

                var projectService = mockProjectServiceWithDatabaseConnectionError();
                
                projectService().getOne({}, false, function (err) {

                    err.should.be.ok;

                    done();

                });

            });

        it('should add a published property to the collection query if includeUnpblished is false',
            function (done) {

                var calls = 0;
                var projectService = mockProjectServiceWithFindSpy(function (q) {

                    q.published.$exists.should.be.true;
                    calls++;

                });

                projectService().getOne({}, false, function () {

                    calls.should.equal(1);

                    done();

                });

            });

        it('should not add a published property to the collection query if includeUnpblished is true',
            function (done) {

                var calls = 0;
                var projectService = mockProjectServiceWithFindSpy(function (q) {

                    should(q.published).equal(undefined);
                    calls++;

                });

                projectService().getOne({}, true, function () {

                    calls.should.equal(1);

                    done();

                });

            });

        it('should supply an error to the callback if a query execption occurs',
            function (done) {

                var projectService = mockProjectServiceWithCollectionOperationError();
                
                projectService().getOne({}, false, function (err) {

                    err.should.be.ok;

                    done();

                });

            });

        it('should call back with null when no matching project is found',
            function (done) {

                var projectService = mockProjectServiceWithNoFindResult();

                projectService().getOne({}, false, function (err, project) {

                    should(project).equal(null);

                    done();

                });

            });

        it('should call back with a project object when a project is found',
            function (done) {

                var projectService = mockProjectServiceWithFindResult();

                projectService().getOne({}, false, function (err, project) {

                    project.should.be.an.instanceof(Project);

                    done();

                });

            });

    });

    describe('getRecent', function () {

        it('should supply an error to the callback if a database execption occurs',
            function (done) {

                var projectService = mockProjectServiceWithDatabaseConnectionError();
                projectService().getRecent(0, false, function (err) {

                    err.should.be.ok;

                    done();

                });

            });

        it('should add a published property to the collection query if includeUnpblished is false',
            function (done) {

                var calls = 0;
                var projectService = mockProjectServiceWithFindSpy(function (q) {

                    q.published.$exists.should.be.true;
                    calls++;

                });

                projectService().getRecent(0, false, function () {

                    calls.should.equal(1);

                    done();

                });

            });

        it('should not add a published property to the collection query if includeUnpblished is true',
            function (done) {

                var calls = 0;
                var projectService = mockProjectServiceWithFindSpy(function (q) {

                    should(q.published).equal(undefined);
                    calls++;

                });

                projectService().getRecent(0, true, function () {

                    calls.should.equal(1);

                    done();

                });

            });

        it('should supply an error to the callback if a query execption occurs',
            function (done) {

                var projectService = mockProjectServiceWithCollectionOperationError();
                
                projectService().getRecent(0, false, function (err) {

                    err.should.be.ok;

                    done();

                });

            });

        it('should call back with an empty array when no projects are found',
            function (done) {

                var projectService = mockProjectServiceWithNoFindResult();

                projectService().getRecent(0, false, function (err, projects) {

                    projects.should.be.an.instanceof(Array);

                    done();

                });

            });

        it('should call back with an array of project objects when a project is found',
            function (done) {

                var projectService = mockProjectServiceWithFindResult();

                projectService().getRecent(0, false, function (err, projects) {

                    projects.map(function (item) {

                        item.should.be.an.instanceof(Project);

                    });
                    
                    done();

                });

            });

    });

    describe('deleteOne', function () {

        it('should supply an error to the callback if a database execption occurs',
            function (done) {

                var projectService = mockProjectServiceWithDatabaseConnectionError();
                
                projectService().deleteOne('507f1f77bcf86cd799439011', 
                    function (err) {

                        err.should.be.ok;

                        done();

                    });

            });

        it('should supply an error to the callback if a collection exception occurs',
            function (done) {

                var projectService = mockProjectServiceWithCollectionOperationError();

                projectService().deleteOne('507f1f77bcf86cd799439011', 
                    function (err) {

                        err.should.be.ok;

                        done();

                    });

            });

    });

});