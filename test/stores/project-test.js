var should = require('should');
var rewire = require('rewire');
var path = require('path');

var projectCollection = 'projects';
var getRewiredProjectStore = function () {
    return rewire(
        path.join(
            process.cwd(),
            './stores/project'));
};

var mockProjectStoreWithError = function () {
    var projectStore = getRewiredProjectStore();

    projectStore.__set__('websiteStore', {
        upsertOne: function (b, t, p, cb) {
            cb({});
        },
        getOne: function (b, q, i, cb) {
            cb({});
        },
        getRecent: function (b, p, i, cb) {
            cb({});
        },
        deleteOne: function (b, i, cb) {
            cb({});
        }
    });

    return projectStore;
};

var mockProjectStoreWithCollectionSpy = function (spy) {
    var projectStore = getRewiredProjectStore();

    projectStore.__set__('websiteStore', {
        upsertOne: function (b, p, cb) {
            spy(b);
        },
        getOne: function (b, q, i, cb) {
            spy(b);
        },
        getRecent: function (b, p, i, cb) {
            spy(b);
        },
        deleteOne: function (b, i, cb) {
            spy(b);
        }
    });

    return projectStore;
};

describe('projectStore', function () {
    before(function () {
        process.chdir('./build/');
    });

    after(function () {
        process.chdir('../');
    });

    describe('upsertOne', function () {
        it('should add an error to the callback if an exception occurs within the repository',
            function (done) {
                var projectStore = mockProjectStoreWithError();

                projectStore.upsertOne({}, function (err) {
                    err.should.be.ok;

                    done();
                });
            });

        it('should supply the correct collection name to the repository',
            function (done) {
                var projectStore = mockProjectStoreWithCollectionSpy(function (collection) {
                    collection.should.equal(projectCollection);

                    done();
                });

                projectStore.upsertOne({}, function () {});
            });
    });

    describe('getOne', function () {
        it('should add an error to the callback if an exception occurs within the repository',
            function (done) {
                var projectStore = mockProjectStoreWithError();

                projectStore.getOne({}, true, function (err) {
                    err.should.be.ok;

                    done();
                });
            });

        it('should supply the correct collection name to the repository',
            function (done) {
                var projectStore = mockProjectStoreWithCollectionSpy(function (collection) {
                    collection.should.equal(projectCollection);

                    done();
                });

                projectStore.getOne({}, true, function () {});
            });
    });

    describe('getRecent', function () {
        it('should add an error to the callback if an exception occurs within the repository',
            function (done) {
                var projectStore = mockProjectStoreWithError();

                projectStore.getRecent(0, true, function (err) {
                    err.should.be.ok;

                    done();
                });
            });

        it('should supply the correct collection name to the repository',
            function (done) {
                var projectStore = mockProjectStoreWithCollectionSpy(function (collection) {
                    collection.should.equal(projectCollection);

                    done();
                });

                projectStore.getRecent(0, true, function () {});
            });
    });

    describe('deleteOne', function () {
        it('should add an error to the callback if an exception occurs within the repository',
            function (done) {
                var projectStore = mockProjectStoreWithError();

                projectStore.deleteOne('123456789', function (err) {
                    err.should.be.ok;

                    done();
                });
            });

        it('should supply the correct collection name to the repository',
            function (done) {
                var projectStore = mockProjectStoreWithCollectionSpy(function (collection) {
                    collection.should.equal(projectCollection);

                    done();
                });

                projectStore.deleteOne('123456789', function () {});
            });
    });
});