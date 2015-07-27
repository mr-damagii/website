var should = require('should');
var rewire = require('rewire');

var path = require('path');

var blogCollection = 'blogs';
var getRewiredBlogService = function () {
    return rewire(
        path.join(
            process.cwd(), 
            './services/blogService'));
};

var mockBlogServiceWithError = function () {
    var blogService = getRewiredBlogService();

    blogService.__set__('websiteRepository', {
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

    return blogService;
};

var mockBlogServiceWithCollectionSpy = function (spy) {
    var blogService = getRewiredBlogService();

    blogService.__set__('websiteRepository', {
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

    return blogService;
};

describe('blogService', function () {
    describe('upsertOne', function () {
        it('should add an error to the callback if an exception occurs within the repository',
            function (done) {
                var blogService = mockBlogServiceWithError();

                blogService.upsertOne({}, function (err) {
                    err.should.be.ok;

                    done();
                });
            });

        it('should supply the correct collection name to the repository',
            function (done) {
                var blogService = mockBlogServiceWithCollectionSpy(function (collection) {
                    collection.should.equal(blogCollection);

                    done();
                });

                blogService.upsertOne({}, function () {});
            });
    });

    describe('getOne', function () {
        it('should add an error to the callback if an exception occurs within the repository',
            function (done) {
                var blogService = mockBlogServiceWithError();

                blogService.getOne({}, true, function (err) {
                    err.should.be.ok;

                    done();
                });
            });

        it('should supply the correct collection name to the repository',
            function (done) {
                var blogService = mockBlogServiceWithCollectionSpy(function (collection) {
                    collection.should.equal(blogCollection);

                    done();
                });

                blogService.getOne({}, true, function () {});
            });
    });

    describe('getRecent', function () {
        it('should add an error to the callback if an exception occurs within the repository',
            function (done) {
                var blogService = mockBlogServiceWithError();

                blogService.getRecent(0, true, function (err) {
                    err.should.be.ok;

                    done();
                });
            });

        it('should supply the correct collection name to the repository',
            function (done) {
                var blogService = mockBlogServiceWithCollectionSpy(function (collection) {
                    collection.should.equal(blogCollection);

                    done();
                });

                blogService.getRecent(0, true, function () {});
            });
    });

    describe('deleteOne', function () {
        it('should add an error to the callback if an exception occurs within the repository',
            function (done) {
                var blogService = mockBlogServiceWithError();

                blogService.deleteOne('123456789', function (err) {
                    err.should.be.ok;

                    done();
                });
            });

        it('should supply the correct collection name to the repository',
            function (done) {
                var blogService = mockBlogServiceWithCollectionSpy(function (collection) {
                    collection.should.equal(blogCollection);

                    done();
                });

                blogService.deleteOne('123456789', function () {});
            });
    });
});