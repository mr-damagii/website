var fs = require('fs');
var path = require('path');

var websiteRepository = require('../repositories/websiteRepository');

var adminCollection = 'admins';

module.exports = {
    upsertOne: function (admin, cb) {
        websiteRepository.upsertOne(
            adminCollection,
            false,
            admin,
            cb);
    },
    getOne: function (query, cb) {
        websiteRepository.getOne(
            adminCollection,
            query,
            true,
            cb);
    }
};