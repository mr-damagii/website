var mongodb = require('mongodb');
var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var websiteStore = require('./website');
var Project = require('../core/project');

var projectCollection = 'projects';

var ObjectId = mongodb.ObjectID;

module.exports = {
    upsertOne: function (proj, cb) {
        websiteStore.upsertOne(
            projectCollection,
            true,
            proj,
            cb);
    },
    getOne: function (query, includeUnpublished, cb) {
        websiteStore.getOne(
            projectCollection,
            query,
            includeUnpublished,
            cb);
    },
    getRecent: function (page, includeUnpublished, cb) {
        websiteStore.getRecent(
            projectCollection,
            page,
            includeUnpublished,
            cb);
    },
    deleteOne: function (id, cb) {
        websiteStore.deleteOne(
            projectCollection,
            id,
            cb);
    }
};