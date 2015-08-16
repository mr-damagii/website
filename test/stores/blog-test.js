var should = require('should');
var rewire = require('rewire');
var path = require('path');

var blogCollection = 'blogs';
var getRewiredBlogStore = function () {
    return rewire(
        path.join(
            process.cwd(),
            './stores/blog'));
};

var mockBlogStoreWithError = function () {
    var blogStore = getRewiredBlogStore();

    blogStore.__set__('websiteStore', {
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

    return blogStore;
};

var mockBlogStoreWithCollectionSpy = function (spy) {
    var blogStore = getRewiredBlogStore();

    blogStore.__set__('websiteStore', {
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

    return blogStore;
};

describe('blogStore', function () {
    before(function () {
        process.chdir('./build/');
    });

    after(function () {
        process.chdir('../');
    });

    describe('upsertOne', function () {
        it('should add an error to the callback if an exception occurs within the repository',
            function (done) {
                var blogStore = mockBlogStoreWithError();

                blogStore.upsertOne({}, function (err) {
                    err.should.be.ok;

                    done();
                });
            });

        it('should supply the correct collection name to the repository',
            function (done) {
                var blogStore = mockBlogStoreWithCollectionSpy(function (collection) {
                    collection.should.equal(blogCollection);

                    done();
                });

                blogStore.upsertOne({}, function () {});
            });
    });

    describe('getOne', function () {
        it('should add an error to the callback if an exception occurs within the repository',
            function (done) {
                var blogStore = mockBlogStoreWithError();

                blogStore.getOne({}, true, function (err) {
                    err.should.be.ok;

                    done();
                });
            });

        it('should supply the correct collection name to the repository',
            function (done) {
                var blogStore = mockBlogStoreWithCollectionSpy(function (collection) {
                    collection.should.equal(blogCollection);

                    done();
                });

                blogStore.getOne({}, true, function () {});
            });
    });

    describe('getRecent', function () {
        it('should add an error to the callback if an exception occurs within the repository',
            function (done) {
                var blogStore = mockBlogStoreWithError();

                blogStore.getRecent(0, true, function (err) {
                    err.should.be.ok;

                    done();
                });
            });

        it('should supply the correct collection name to the repository',
            function (done) {
                var blogStore = mockBlogStoreWithCollectionSpy(function (collection) {
                    collection.should.equal(blogCollection);

                    done();
                });

                blogStore.getRecent(0, true, function () {});
            });
    });

    describe('deleteOne', function () {
        it('should add an error to the callback if an exception occurs within the repository',
            function (done) {
                var blogStore = mockBlogStoreWithError();

                blogStore.deleteOne('123456789', function (err) {
                    err.should.be.ok;

                    done();
                });
            });

        it('should supply the correct collection name to the repository',
            function (done) {
                var blogStore = mockBlogStoreWithCollectionSpy(function (collection) {
                    collection.should.equal(blogCollection);

                    done();
                });

                blogStore.deleteOne('123456789', function () {});
            });
    });
});