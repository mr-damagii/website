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

var Blog = require('../models/blog');
var blogCollection = 'blogs';

module.exports = {
    upsertOne: function (proj, cb) {
        websiteRepository.upsertOne(
            blogCollection,
            true,
            proj,
            cb);
    },
    getOne: function (query, includeUnpublished, cb) {
        websiteRepository.getOne(
            blogCollection,
            query,
            includeUnpublished,
            cb);
    },
    getRecent: function (page, includeUnpublished, cb) {
        websiteRepository.getRecent(
            blogCollection,
            page,
            includeUnpublished,
            cb);
    },
    deleteOne: function (id, cb) {
        websiteRepository.deleteOne(
            blogCollection,
            id,
            cb);
    }
};