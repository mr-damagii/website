var mongoClient = require('mongodb').MongoClient;
var _ = require('underscore');

var fs = require('fs');
var path = require('path');

var config = JSON.parse(
    fs.readFileSync(
        path.join(
            process.cwd(), 
            './config.json')));

var PAGE_SIZE = 20;

var _openConn = function (collection, cb) {
    mongoClient.connect(
        config.databaseConnectionString, 
        function (err, db) {
            if (err) {
                try { 
                    db.close();
                } catch (ex) { }

                cb(err);
                return;
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
                cb(err);

                done();

                return;
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

                    done();

                    return;
                }

                cb(null);

                done();
            });
        });
    },
    getOne: function (col, query, includeUnpublished, cb) {
        _openConn(col, function (err, collection, done) {
            if (err) {
                cb(err);

                done();

                return;
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

                        done();

                        return;
                    }

                    cb(
                        null, 
                        docs && docs[0] ? docs[0] : null);

                    done();
                });
        });
    },
    getRecent: function (col, page, includeUnpublished, cb) {
        if (typeof page === 'undefined') {
            page = 0;
        }

        _openConn(col, function (err, collection, done) {
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

                    cb(null, docs);

                    done();
                });
        });
    },
    deleteOne: function (col, id, cb) {
        _openConn(col, function (err, collection, done) {
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