var fs = require('fs');
var path = require('path');

var config = JSON.parse(
    fs.readFileSync(
        './config.json'));

var express = require('express');
var app = express();

app.use('/client', express.static('client'));

var hbs = require('express-hbs');
app.engine('hbs', hbs.express4({

    partialsDir: __dirname + '/views/partials'

}));

var projectService = require('./services/projectService')();

require('./views/helpers/reactHelper')(hbs);
require('./views/helpers/thumbnailPictureHelper')(hbs);
require('./views/helpers/markdownHelper')(hbs);

app.set('view engine', 'hbs');

require('./controllers/adminController')(app);

var server = app.listen(1338, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('app listening at http://%s:%s', host, port);

});