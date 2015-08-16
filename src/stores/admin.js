var fs = require('fs');
var path = require('path');
var websiteStore = require('./website');

var adminCollection = 'admins';

module.exports = {
    upsertOne: function (admin, cb) {
        websiteStore.upsertOne(
            adminCollection,
            false,
            admin,
            cb);
    },
    getOne: function (query, cb) {
        websiteStore.getOne(
            adminCollection,
            query,
            true,
            cb);
    }
};