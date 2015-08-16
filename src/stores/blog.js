var mongodb = require('mongodb');
var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var websiteStore = require('./website');
var Blog = require('../core/blog');

var blogCollection = 'blogs';

var ObjectId = mongodb.ObjectID;

module.exports = {
    upsertOne: function (proj, cb) {
        websiteStore.upsertOne(
            blogCollection,
            true,
            proj,
            cb);
    },
    getOne: function (query, includeUnpublished, cb) {
        websiteStore.getOne(
            blogCollection,
            query,
            includeUnpublished,
            cb);
    },
    getRecent: function (page, includeUnpublished, cb) {
        websiteStore.getRecent(
            blogCollection,
            page,
            includeUnpublished,
            cb);
    },
    deleteOne: function (id, cb) {
        websiteStore.deleteOne(
            blogCollection,
            id,
            cb);
    }
};