var should = require('should');
var rewire = require('rewire');

var path = require('path');

var mockMongoClient = function () {

    return {

        connect: function (a, b) {
            
            b({});

        }

    }

};

describe('websiteRepository', function () {

    describe('openConn', function () {

        it('should supply an error to the callback if an exception occurs while opening the database', 
            function (done) {

                var websiteRepository = rewire(
                    path.join(
                        process.cwd(), 
                        './repositories/websiteRepository'));
                
                websiteRepository.__set__(
                    'mongoClient', 
                    mockMongoClient());

                websiteRepository.openConn('test', function (err, col, d) {

                    err.should.be.ok;

                    done();

                });

            });
        
    });

});