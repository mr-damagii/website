var should = require('should');
var rewire = require('rewire');
var path = require('path');

var adminCollection = 'admins';
var getRewiredAdminStore = function () {
    return rewire(
        path.join(
            process.cwd(),
            './stores/admin'));
};

var mockAdminStoreWithError = function () {
    var adminStore = getRewiredAdminStore();

    adminStore.__set__('websiteStore', {
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

    return adminStore;
};

var mockAdminStoreWithCollectionSpy = function (spy) {
    var adminStore = getRewiredAdminStore();

    adminStore.__set__('websiteStore', {
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

    return adminStore;
};

describe('adminStore', function () {
    before(function () {
        process.chdir('./build/');
    });

    after(function () {
        process.chdir('../');
    });

    describe('upsertOne', function () {
        it('should add an error to the callback if an exception occurs with the repository',
            function (done) {
                var adminStore = mockAdminStoreWithError();

                adminStore.upsertOne({}, function (err) {
                    err.should.be.ok;

                    done();
                });
            });

        it('should supply the correct collection name to the repository',
            function (done) {
                var adminStore = mockAdminStoreWithCollectionSpy(function (collection) {
                    collection.should.equal(adminCollection);

                    done();
                });

                adminStore.upsertOne({}, function () {});
            });
    });

    describe('getOne', function () {
        it('should add an error to the callback if an exception occurs with the repository',
            function (done) {
                var adminStore = mockAdminStoreWithError();

                adminStore.getOne({}, function (err) {
                    err.should.be.ok;

                    done();
                });
            });

        it('should supply the correct collection name to the repository',
            function (done) {
                var adminStore = mockAdminStoreWithCollectionSpy(function (collection) {
                    collection.should.equal(adminCollection);

                    done();
                });

                adminStore.getOne({}, function () {});
            });
    });
});