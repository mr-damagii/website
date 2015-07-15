var should = require('should');
var rewire = require('rewire');

var path = require('path');

var Blog = require('../../models/blog');

var getRewiredBlogService = function () {

    return rewire(
        path.join(
            process.cwd(), 
            './services/blogService'));

};

var mockBlogServiceWithDatabaseConnectionError = function () {

    var blogService = getRewiredBlogService();

    blogService.__set__('_openConn', function (cb) {

        cb({}, null, function () {});

    });

    return blogService;

};

var mockBlogServiceWithCollectionOperationError = function () {

    var blogService = getRewiredBlogService();

    blogService.__set__('_openConn', function (cb) {

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

    return blogService;

};

var mockBlogServiceWithUpdateOneSpy = function (updateOneSpy) {

    var blogService = getRewiredBlogService();

    blogService.__set__('_openConn', function (cb) {

        cb(null, {

            updateOne: function (f, q, o, c) {

                updateOneSpy(f, q, o, c);

                c(null);

            }

        }, function () {});

    });

    return blogService;

};

var mockBlogServiceWithFindSpy = function (findSpy) {

    var blogService = getRewiredBlogService();

    blogService.__set__('_openConn', function (cb) {

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

    return blogService;

};

var mockBlogServiceWithNoFindResult = function () {

    var blogService = getRewiredBlogService();

    blogService.__set__('_openConn', function (cb) {

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

    return blogService;

};

var mockBlogServiceWithFindResult = function () {

    var blogService = getRewiredBlogService();

    blogService.__set__('_openConn', function (cb) {

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

    return blogService;

};

describe('blogService', function () {

    describe('upsertOne', function () {

        it('should supply an error to the callback if a database exception occurs',
            function (done) {

                var blogService = mockBlogServiceWithDatabaseConnectionError();
                blogService().upsertOne({}, function (err, col, d) {

                    err.should.be.ok;

                    done();

                });

            });

        it('should call updateOne with the upsert option set to true',
            function (done) {

                var calls = 0;
                var blogService = mockBlogServiceWithUpdateOneSpy(function (f, q, o, c) {

                    o.upsert.should.be.true;
                    calls++;

                });

                blogService().upsertOne({ _id: '' }, function (err, col, d) {

                    calls.should.equal(1);
                    
                    done();

                });

            });

        it('should supply an error to the callback if a collection exception occurs',
            function (done) {

                var blogService = mockBlogServiceWithCollectionOperationError();

                blogService().upsertOne({ _id: '' }, function (err) {

                    err.should.be.ok;

                    done();

                });

            });

    });

    describe('getOne', function () {

        it('should supply an error to the callback if a database execption occurs',
            function (done) {

                var blogService = mockBlogServiceWithDatabaseConnectionError();
                
                blogService().getOne({}, false, function (err) {

                    err.should.be.ok;

                    done();

                });

            });

        it('should add a published property to the collection query if includeUnpblished is false',
            function (done) {

                var calls = 0;
                var blogService = mockBlogServiceWithFindSpy(function (q) {

                    q.published.$exists.should.be.true;
                    calls++;

                });

                blogService().getOne({}, false, function () {

                    calls.should.equal(1);

                    done();

                });

            });

        it('should not add a published property to the collection query if includeUnpblished is true',
            function (done) {

                var calls = 0;
                var blogService = mockBlogServiceWithFindSpy(function (q) {

                    should(q.published).equal(undefined);
                    calls++;

                });

                blogService().getOne({}, true, function () {

                    calls.should.equal(1);

                    done();

                });

            });

        it('should supply an error to the callback if a query execption occurs',
            function (done) {

                var blogService = mockBlogServiceWithCollectionOperationError();
                
                blogService().getOne({}, false, function (err) {

                    err.should.be.ok;

                    done();

                });

            });

        it('should call back with null when no matching blog is found',
            function (done) {

                var blogService = mockBlogServiceWithNoFindResult();

                blogService().getOne({}, false, function (err, blog) {

                    should(blog).equal(null);

                    done();

                });

            });

        it('should call back with a blog object when a blog is found',
            function (done) {

                var blogService = mockBlogServiceWithFindResult();

                blogService().getOne({}, false, function (err, blog) {

                    blog.should.be.an.instanceof(Blog);

                    done();

                });

            });

    });

    describe('getRecent', function () {

        it('should supply an error to the callback if a database execption occurs',
            function (done) {

                var blogService = mockBlogServiceWithDatabaseConnectionError();
                blogService().getRecent(0, false, function (err) {

                    err.should.be.ok;

                    done();

                });

            });

        it('should add a published property to the collection query if includeUnpblished is false',
            function (done) {

                var calls = 0;
                var blogService = mockBlogServiceWithFindSpy(function (q) {

                    q.published.$exists.should.be.true;
                    calls++;

                });

                blogService().getRecent(0, false, function () {

                    calls.should.equal(1);

                    done();

                });

            });

        it('should not add a published property to the collection query if includeUnpblished is true',
            function (done) {

                var calls = 0;
                var blogService = mockBlogServiceWithFindSpy(function (q) {

                    should(q.published).equal(undefined);
                    calls++;

                });

                blogService().getRecent(0, true, function () {

                    calls.should.equal(1);

                    done();

                });

            });

        it('should supply an error to the callback if a query execption occurs',
            function (done) {

                var blogService = mockBlogServiceWithCollectionOperationError();
                
                blogService().getRecent(0, false, function (err) {

                    err.should.be.ok;

                    done();

                });

            });

        it('should call back with an empty array when no blogs are found',
            function (done) {

                var blogService = mockBlogServiceWithNoFindResult();

                blogService().getRecent(0, false, function (err, blogs) {

                    blogs.should.be.an.instanceof(Array);

                    done();

                });

            });

        it('should call back with an array of blog objects when a blog is found',
            function (done) {

                var blogService = mockBlogServiceWithFindResult();

                blogService().getRecent(0, false, function (err, blogs) {

                    blogs.map(function (item) {

                        item.should.be.an.instanceof(Blog);

                    });
                    
                    done();

                });

            });

    });

    describe('deleteOne', function () {

        it('should supply an error to the callback if a database execption occurs',
            function (done) {

                var blogService = mockBlogServiceWithDatabaseConnectionError();
                
                blogService().deleteOne('507f1f77bcf86cd799439011', 
                    function (err) {

                        err.should.be.ok;

                        done();

                    });

            });

        it('should supply an error to the callback if a collection exception occurs',
            function (done) {

                var blogService = mockBlogServiceWithCollectionOperationError();

                blogService().deleteOne('507f1f77bcf86cd799439011', 
                    function (err) {

                        err.should.be.ok;

                        done();

                    });

            });

    });

});