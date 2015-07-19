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

require('./views/helpers/ifEvenHelper')(hbs);
require('./views/helpers/reactHelper')(hbs);
require('./views/helpers/pictureHelper')(hbs);
require('./views/helpers/markdownHelper')(hbs);

app.set('view engine', 'hbs');

app.get('/', function (req, res) {

    projectService.getRecent(
        req.query.page || 0, 
        false,
        function (err, projects) {

            res.render('index.hbs', {

                preview: {

                    header: 'Recent Projects',


                    items: projects.slice(0, 3)

                }

            });

        });

});

require('./controllers/projectController')(app);
require('./controllers/blogController')(app);

app.get('/about', function (req, res) {

    res.render('about.hbs', {

        header: {

            title: 'About Me'

        }

    });

});

var server = app.listen(config.port, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('app listening at http://%s:%s', host, port);

});