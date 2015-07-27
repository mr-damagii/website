var should = require('should');
var rewire = require('rewire');

var path = require('path');

var adminCollection = 'admins';
var getRewiredAdminService = function () {
    return rewire(
        path.join(
            process.cwd(),
            './services/adminService'));
};

var mockAdminServiceWithError = function () {
    var adminService = getRewiredAdminService();

    adminService.__set__('websiteRepository', {
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

    return adminService;
};

var mockAdminServiceWithCollectionSpy = function (spy) {
    var adminService = getRewiredAdminService();

    adminService.__set__('websiteRepository', {
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

    return adminService;
};

describe('adminService', function () {
    describe('upsertOne', function () {
        it('should add an error to the callback if an exception occurs with the repository',
            function (done) {
                var adminService = mockAdminServiceWithError();

                adminService.upsertOne({}, function (err) {
                    err.should.be.ok;

                    done();
                });
            });

        it('should supply the correct collection name to the repository',
            function (done) {
                var adminService = mockAdminServiceWithCollectionSpy(function (collection) {
                    collection.should.equal(adminCollection);

                    done();
                });

                adminService.upsertOne({}, function () {});
            });
    });

    describe('getOne', function () {
        it('should add an error to the callback if an exception occurs with the repository',
            function (done) {
                var adminService = mockAdminServiceWithError();

                adminService.getOne({}, function (err) {
                    err.should.be.ok;

                    done();
                });
            });

        it('should supply the correct collection name to the repository',
            function (done) {
                var adminService = mockAdminServiceWithCollectionSpy(function (collection) {
                    collection.should.equal(adminCollection);

                    done();
                });

                adminService.getOne({}, function () {});
            });
    });
});