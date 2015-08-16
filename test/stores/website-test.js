var should = require('should');
var rewire = require('rewire');
var path = require('path');

var getRewiredWebsiteStore = function () {
    return rewire(
        path.join(
            process.cwd(),
            './stores/website'));
};

var mockMongoClient = function () {
    return {
        connect: function (a, b) {
            b({});
        }
    }
};

var mockWebsiteStoreWithDatabaseConnectionError = function () {
    var websiteStore = getRewiredWebsiteStore();

    websiteStore.__set__('_openConn', function (collection, cb) {
        cb({}, null, function () {});
    });

    return websiteStore;
};

var mockWebsiteStoreWithCollectionOperationError = function () {
    var websiteStore = getRewiredWebsiteStore();

    websiteStore.__set__('_openConn', function (collection, cb) {
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

    return websiteStore;
};

var mockWebsiteStoreWithUpdateOneSpy = function (updateOneSpy) {
    var websiteStore = getRewiredWebsiteStore();

    websiteStore.__set__('_openConn', function (collection, cb) {
        cb(null, {
            updateOne: function (f, q, o, c) {
                updateOneSpy(f, q, o, c);

                c(null);
            }
        }, function () {});
    });

    return websiteStore;
};

var mockWebsiteStoreWithFindSpy = function (findSpy) {
    var websiteStore = getRewiredWebsiteStore();

    websiteStore.__set__('_openConn', function (collection, cb) {
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

    return websiteStore;
};

var mockWebsiteStoreWithNoFindResult = function () {
    var websiteStore = getRewiredWebsiteStore();

    websiteStore.__set__('_openConn', function (collection, cb) {
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

    return websiteStore;
};

var mockWebsiteStoreWithFindResult = function () {
    var websiteStore = getRewiredWebsiteStore();

    websiteStore.__set__('_openConn', function (collection, cb) {
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
                                                    _id: '507f1f77bcf86cd799439011'
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
                            _id: '507f1f77bcf86cd799439011'
                        }]);
                    }
                };
            }
        }, function () {});
    });

    return websiteStore;
};

describe('websiteStore', function () {
    before(function () {
        process.chdir('./build/');
    });

    after(function () {
        process.chdir('../');
    });

    describe('upsertOne', function () {
        it('should supply an error to the callback if a database exception occurs',
            function (done) {
                var websiteStore = mockWebsiteStoreWithDatabaseConnectionError();
                websiteStore.upsertOne('test', false, {}, function (err, col, d) {
                    err.should.be.ok;

                    done();
                });
            });

        it('should call updateOne with the upsert option set to true',
            function (done) {
                var calls = 0;
                var websiteStore = mockWebsiteStoreWithUpdateOneSpy(function (f, q, o, c) {
                    o.upsert.should.be.true;
                    calls++;
                });

                websiteStore.upsertOne('test', false, { _id: '' }, function (err, col, d) {
                    calls.should.equal(1);

                    done();
                });
            });

        it('should supply an error to the callback if a collection exception occurs',
            function (done) {
                var websiteStore = mockWebsiteStoreWithCollectionOperationError();

                websiteStore.upsertOne('test', false, { _id: '' }, function (err) {
                    err.should.be.ok;

                    done();
                });
            });
    });

    describe('getOne', function () {

        it('should supply an error to the callback if a database execption occurs',
            function (done) {
                var websiteStore = mockWebsiteStoreWithDatabaseConnectionError();

                websiteStore.getOne('test', {}, false, function (err) {
                    err.should.be.ok;

                    done();
                });
            });

        it('should add a published property to the collection query if includeUnpblished is false',
            function (done) {
                var calls = 0;
                var websiteStore = mockWebsiteStoreWithFindSpy(function (q) {
                    q.published.$exists.should.be.true;
                    calls++;
                });

                websiteStore.getOne('test', {}, false, function () {
                    calls.should.equal(1);

                    done();
                });
            });

        it('should not add a published property to the collection query if includeUnpblished is true',
            function (done) {
                var calls = 0;
                var websiteStore = mockWebsiteStoreWithFindSpy(function (q) {
                    should(q.published).equal(undefined);
                    calls++;
                });

                websiteStore.getOne('test', {}, true, function () {
                    calls.should.equal(1);

                    done();
                });
            });

        it('should supply an error to the callback if a query execption occurs',
            function (done) {
                var websiteStore = mockWebsiteStoreWithCollectionOperationError();

                websiteStore.getOne('test', {}, false, function (err) {
                    err.should.be.ok;

                    done();
                });
            });

        it('should call back with null when no matching website is found',
            function (done) {
                var websiteStore = mockWebsiteStoreWithNoFindResult();

                websiteStore.getOne('test', {}, false, function (err, website) {
                    should(website).equal(null);

                    done();
                });
            });
    });

    describe('getRecent', function () {
        it('should supply an error to the callback if a database execption occurs',
            function (done) {
                var websiteStore = mockWebsiteStoreWithDatabaseConnectionError();
                websiteStore.getRecent('test', 0, false, function (err) {
                    err.should.be.ok;

                    done();
                });
            });

        it('should add a published property to the collection query if includeUnpblished is false',
            function (done) {
                var calls = 0;
                var websiteStore = mockWebsiteStoreWithFindSpy(function (q) {
                    q.published.$exists.should.be.true;
                    calls++;
                });

                websiteStore.getRecent('test', 0, false, function () {
                    calls.should.equal(1);

                    done();
                });
            });

        it('should not add a published property to the collection query if includeUnpblished is true',
            function (done) {
                var calls = 0;
                var websiteStore = mockWebsiteStoreWithFindSpy(function (q) {
                    should(q.published).equal(undefined);
                    calls++;
                });

                websiteStore.getRecent('test', 0, true, function () {
                    calls.should.equal(1);

                    done();
                });
            });

        it('should supply an error to the callback if a query execption occurs',
            function (done) {
                var websiteStore = mockWebsiteStoreWithCollectionOperationError();

                websiteStore.getRecent('test', 0, false, function (err) {
                    err.should.be.ok;

                    done();
                });
            });

        it('should call back with an empty array when no websites are found',
            function (done) {
                var websiteStore = mockWebsiteStoreWithNoFindResult();

                websiteStore.getRecent('test', 0, false, function (err, websites) {
                    websites.should.be.an.instanceof(Array);

                    done();
                });
            });
    });

    describe('deleteOne', function () {
        it('should supply an error to the callback if a database execption occurs',
            function (done) {
                var websiteStore = mockWebsiteStoreWithDatabaseConnectionError();

                websiteStore.deleteOne('test', '507f1f77bcf86cd799439011',
                    function (err) {
                        err.should.be.ok;

                        done();
                    });
            });

        it('should supply an error to the callback if a collection exception occurs',
            function (done) {
                var websiteStore = mockWebsiteStoreWithCollectionOperationError();

                websiteStore.deleteOne('test', '507f1f77bcf86cd799439011',
                    function (err) {
                        err.should.be.ok;

                        done();
                    });
            });
    });
});