var winston = require('winston');
var path = require('path');

var config = require('./repositories/configurationRepository');

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            level: 'debug',
            colorize: true
        }),
        new (winston.transports.File)({
            level: config.main.logging.level,
            filename: config.main.logging.file,
            maxsize: config.main.logging.maxSize,
            zippedArchive: config.main.logging.zipArchive
        })
    ]
});

var express = require('express');
var app = express();

var routeErrorHelper = require('./helpers/routeErrorHelper');

app.use(function (req, res, next) {
    logger.verbose('Request: "' + req.url + '"');

    next();
});

app.use('/client', express.static('client'));

var hbs = require('express-hbs');
app.engine('hbs', hbs.express4({
    partialsDir: __dirname + '/views/partials'
}));

var projectService = require('./services/projectService');

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
            if (err) {
                routeErrorHelper.handleErrorNoOp(err, req, res, logger);
            }

            res.render('index.hbs', {
                preview: {
                    header: 'Recent Projects',
                    items: projects && projects.length ? projects.slice(0, 3) : []
                }
            });
        });
});

require('./controllers/authController')(app, logger);
require('./controllers/projectController')(app, logger);
require('./controllers/blogController')(app, logger);
require('./controllers/adminController')(app, logger);

app.get('/about', function (req, res) {
    res.render('about.hbs', {
        pagetitle: 'About Me',
        header: {
            title: 'About Me'
        }
    });
});

app.get('/404', function (req, res) {
    res.status(404).render('404.hbs', {
        pagetitle: '404 Page Not Found',
        header: {
            title: '404'
        }
    });
});

app.get('/500', function (req, res) {
    res.status(500).render('500.hbs', {
        pagetitle: '500 Server Error',
        header: {
            title: '500'
        }
    });
});

app.get('/*', function (req, res) {
    routeErrorHelper.handleErrorAs404(new Error('no matching route found'), req, res, logger);
});

app.use(function (err, req, res) {
    routeErrorHelper.handleErrorAs500(err, req, res, logger);
});

var server = app.listen(config.main.port, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('app listening at http://%s:%s', host, port);
});