var winston = require('winston');
var path = require('path');
var express = require('express');
var hbs = require('express-hbs');
var projectStore = require('./stores/project');
var routeErrorHandler = require('./utils/routeErrorHandler');
var config = require('./stores/configuration');

var registerHbsIfEvenHelper = require('./utils/handlebars/ifEvenHelper');
var registerHbsPictureHelper = require('./utils/handlebars/pictureHelper');
var registerHbsMarkdownHelper = require('./utils/handlebars/markdownHelper');

var registerAuthApi = require('./api/auth');
var registerProjectApi = require('./api/project');
var registerBlogApi = require('./api/blog');
var registerAdminApi = require('./api/admin');

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

var server = express();

server.use(function (req, res, next) {
    logger.verbose('Request: "' + req.url + '"');

    next();
});

server.use('/client', express.static(__dirname + '/public'));
server.use('/client/styles', express.static(__dirname + '/styles'));

server.engine('hbs', hbs.express4({
    partialsDir: __dirname + '/content/partials'
}));

registerHbsIfEvenHelper(hbs);
registerHbsPictureHelper(hbs);
registerHbsMarkdownHelper(hbs);

server.set('view engine', 'hbs');
server.set('views', __dirname + '/content');

server.get('/', function (req, res) {
    projectStore.getRecent(
        req.query.page || 0,
        false,
        function (err, projects) {
            if (err) {
                routeErrorHandler.handleErrorWithNoOp(err, req, res, logger);
            }

            res.render('index.hbs', {
                preview: {
                    header: 'Recent Projects',
                    items: projects && projects.length ? projects.slice(0, 3) : []
                }
            });
        });
});

registerAuthApi(server, logger);
registerProjectApi(server, logger);
registerBlogApi(server, logger);
registerAdminApi(server, logger);

server.get('/about', function (req, res) {
    res.render('about.hbs', {
        pagetitle: 'About Me',
        header: {
            title: 'About Me'
        }
    });
});

server.get('/404', function (req, res) {
    res.status(404).render('404.hbs', {
        pagetitle: '404 Page Not Found',
        header: {
            title: '404'
        }
    });
});

server.get('/500', function (req, res) {
    res.status(500).render('500.hbs', {
        pagetitle: '500 Server Error',
        header: {
            title: '500'
        }
    });
});

server.use(function (req, res, next) {
    return routeErrorHandler.handleAs404(req, res, logger);
});

server.use(function (err, req, res, next) {
    return routeErrorHandler.handleAs500(err, req, res, logger);
});

var srv = server.listen(config.main.port, function () {
    var host = srv.address().address;
    var port = srv.address().port;

    console.log('server listening at http://%s:%s', host, port);
});