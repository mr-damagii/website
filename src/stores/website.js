var mongodb = require('mongodb');
var _ = require('underscore');
var fs = require('fs');
var path = require('path');
var config = require('./configuration');

var PAGE_SIZE = 20;

var mongoClient = mongodb.MongoClient;
var ObjectId  = mongodb.ObjectID;

var _openConn = function (collection, cb) {
    mongoClient.connect(
        config.main.databaseConnectionString,
        function (err, db) {
            if (err) {
                try { 
                    db.close();
                } catch (ex) { }

                return cb(err);
            }

            var col = db.collection(collection);

            cb(null, col, function () {
                db.close();
            });
        });
};

module.exports = {
    upsertOne: function (col, updateLastModified, doc, cb) {
        _openConn(col, function (err, collection, done) {
            if (err) {
                return cb(err);
            }

            collection.updateOne({
                _id: doc._id
            }, updateLastModified ? {
                    $set: doc,
                    $currentDate: { lastModified: true }
                } : 
                {
                    $set: doc
                }, 
            {
                upsert: true
            }, function (err) {
                if (err) {
                    cb(err);

                    return done();
                }

                cb(null);

                return done();
            });
        });
    },
    getOne: function (col, query, includeUnpublished, cb) {
        _openConn(col, function (err, collection, done) {
            if (err) {
                return cb(err);
            }

            collection
                .find(includeUnpublished ? 
                    query : 
                    _.extend(query, {
                        published: { 
                            $exists: true 
                        }
                    }))
                .toArray(function (errInner, docs) {
                    if (errInner) {
                        cb(errInner);

                        return done();
                    }

                    cb(
                        null, 
                        docs && docs[0] ? docs[0] : null);

                    return done();
                });
        });
    },
    getRecent: function (col, page, includeUnpublished, cb) {
        if (typeof page === 'undefined') {
            page = 0;
        }

        _openConn(col, function (err, collection, done) {
            if (err) {
                return cb(err);
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

                        return done();
                    }

                    cb(null, docs);

                    return done();
                });
        });
    },
    deleteOne: function (col, id, cb) {
        _openConn(col, function (err, collection, done) {
            if (err) {
                return cb(err);
            }

            collection.deleteOne({ 
                _id: new ObjectId(id) 
            }, function (err) {
                if (err) {
                    cb(err);

                    return done();
                }

                return cb(null);
            });
        });
    }
};