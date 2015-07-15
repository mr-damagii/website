var mongoClient = require('mongodb').MongoClient;

var fs = require('fs');
var path = require('path');

var config = JSON.parse(
    fs.readFileSync(
        path.join(
            process.cwd(), 
            './config.json')));

module.exports = {

    openConn: function (col, cb) {

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

                var collection = db.collection(col);

                cb(null, collection, function () {

                    db.close();

                });

            });

    }

};