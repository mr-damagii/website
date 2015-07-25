var ObjectId = require('mongodb').ObjectID;

var fs = require('fs');
var path = require('path');
var _ = require('underscore');

var websiteRepository = require('../repositories/websiteRepository');

var config = JSON.parse(
    fs.readFileSync(
        path.join(
            process.cwd(), 
            './config.json')));

var Project = require('../models/project');
var projectCollection = 'projects';

module.exports = {
    upsertOne: function (proj, cb) {
        websiteRepository.upsertOne(
            projectCollection,
            proj,
            cb);
    },
    getOne: function (query, includeUnpublished, cb) {
        websiteRepository.getOne(
            projectCollection,
            query,
            includeUnpublished,
            cb);
    },
    getRecent: function (page, includeUnpublished, cb) {
        websiteRepository.getRecent(
            projectCollection,
            page,
            includeUnpublished,
            cb);
    },
    deleteOne: function (id, cb) {
        websiteRepository.deleteOne(
            projectCollection,
            id,
            cb);
    }
};