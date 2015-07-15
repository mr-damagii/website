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

var _openConn = function (cb) {

    websiteRepository.openConn('projects', cb);

};

var PAGE_SIZE = 20;

module.exports = function () {

    return {

        upsertOne: function (proj, cb) {

            _openConn(function (err, collection, done) {

                if (err) {

                    cb(err);

                    done();

                    return;

                }

                collection.updateOne({

                    _id: proj._id

                }, {

                    $set: proj,


                    $currentDate: { lastModified: true }

                }, {

                    upsert: true

                }, function (err) {

                    if (err) {

                        cb(err);

                        done();

                        return;

                    }

                    cb(null);

                    done();

                });

            });

        },


        getOne: function (q, includeUnpublished, cb) {

            _openConn(function (err, collection, done) {

                if (err) {

                    cb(err);

                    done();

                    return;

                }

                collection
                    .find(includeUnpublished ? 
                        q : 
                        _.extend(q, {

                            published: { 

                                $exists: true 

                            }

                        }))
                    .toArray(function (errInner, docs) {

                        if (errInner) {

                            cb(errInner);

                            done();

                            return;

                        }

                        cb(
                            null, 
                            docs[0] ? new Project(docs[0]) : null);

                        done();

                    });

            });

        },


        getRecent: function (page, includeUnpublished, cb) {

            if (typeof page === 'undefined') {

                page = 0;

            }

            _openConn(function (err, collection, done) {

                if (err) {

                    cb(err);

                    done();

                    return;

                }

                collection
                    .find(includeUnpublished ? 
                        {} : 
                        {

                            published: { 

                                $exists: true 

                            }
                        })
                    .sort({ published: -1 })
                    .skip(PAGE_SIZE * page)
                    .limit(PAGE_SIZE)
                    .toArray(function (errInner, docs) {

                        if (errInner) {

                            cb(errInner);

                            done();

                            return;

                        }

                        cb(
                            null, 
                            docs.map(function (item) {

                                return new Project(item);

                            }));

                        done();

                    });

            });

        },


        deleteOne: function (id, cb) {

            _openConn(function (err, collection, done) {

                if (err) {

                    cb(err);

                    done();

                    return;

                }

                collection.deleteOne({ 

                    _id: new ObjectId(id) 

                }, function (err) {

                    if (err) {

                        cb(err);

                        done();

                        return;

                    }

                    cb(null);

                });

            });

        }

    };

};