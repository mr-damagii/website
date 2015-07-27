var should = require('should');
var rewire = require('rewire');

var path = require('path');

var projectCollection = 'projects';
var getRewiredProjectService = function () {
    return rewire(
        path.join(
            process.cwd(), 
            './services/projectService'));
};

var mockProjectServiceWithError = function () {
    var projectService = getRewiredProjectService();

    projectService.__set__('websiteRepository', {
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

    return projectService;
};

var mockProjectServiceWithCollectionSpy = function (spy) {
    var projectService = getRewiredProjectService();

    projectService.__set__('websiteRepository', {
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

    return projectService;
};

describe('projectService', function () {
    describe('upsertOne', function () {
        it('should add an error to the callback if an exception occurs within the repository',
            function (done) {
                var projectService = mockProjectServiceWithError();

                projectService.upsertOne({}, function (err) {
                    err.should.be.ok;

                    done();
                });
            });

        it('should supply the correct collection name to the repository',
            function (done) {
                var projectService = mockProjectServiceWithCollectionSpy(function (collection) {
                    collection.should.equal(projectCollection);

                    done();
                });

                projectService.upsertOne({}, function () {});
            });
    });

    describe('getOne', function () {
        it('should add an error to the callback if an exception occurs within the repository',
            function (done) {
                var projectService = mockProjectServiceWithError();

                projectService.getOne({}, true, function (err) {
                    err.should.be.ok;

                    done();
                });
            });

        it('should supply the correct collection name to the repository',
            function (done) {
                var projectService = mockProjectServiceWithCollectionSpy(function (collection) {
                    collection.should.equal(projectCollection);

                    done();
                });

                projectService.getOne({}, true, function () {});
            });
    });

    describe('getRecent', function () {
        it('should add an error to the callback if an exception occurs within the repository',
            function (done) {
                var projectService = mockProjectServiceWithError();

                projectService.getRecent(0, true, function (err) {
                    err.should.be.ok;

                    done();
                });
            });

        it('should supply the correct collection name to the repository',
            function (done) {
                var projectService = mockProjectServiceWithCollectionSpy(function (collection) {
                    collection.should.equal(projectCollection);

                    done();
                });

                projectService.getRecent(0, true, function () {});
            });
    });

    describe('deleteOne', function () {
        it('should add an error to the callback if an exception occurs within the repository',
            function (done) {
                var projectService = mockProjectServiceWithError();

                projectService.deleteOne('123456789', function (err) {
                    err.should.be.ok;

                    done();
                });
            });

        it('should supply the correct collection name to the repository',
            function (done) {
                var projectService = mockProjectServiceWithCollectionSpy(function (collection) {
                    collection.should.equal(projectCollection);

                    done();
                });

                projectService.deleteOne('123456789', function () {});
            });
    });
});