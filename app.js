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

app.get('/', function (req, res) {

    projectService.getRecent(
        req.query.page || 0, 
        false,
        function (err, projects) {

            res.render('index.hbs', {

                header: {

                    title: 'Adam Kent',
                    summary: 'Making software both intuitive and easy on the eyes'

                },


                preview: {

                    header: 'Recent Projects',


                    items: projects.slice(0, 3)

                }

            });

        });

});

require('./controllers/projectController')(app);
require('./controllers/blogController')(app);

app.get('/contact', function (req, res) {

    res.render('contact.hbs', {

        header: {

            title: 'Contact Me',
            summary: 'Find me out and about on the following services or just drop me an email...'

        }

    });

});

var server = app.listen(config.port, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('app listening at http://%s:%s', host, port);

});