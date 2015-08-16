var mongodb = require('mongodb');
var bodyParser = require('body-parser');
var Project  = require('../core/project');
var Blog = require('../core/blog');
var projectStore = require('../stores/project');
var blogStore = require('../stores/blog');
var routeErrorHandler = require('../utils/routeErrorHandler');

var ObjectId = mongodb.ObjectID;
var urlBodyParser = bodyParser.urlencoded();

module.exports = function (server, logger) {
    function ensureAuthenticated(req, res, next) {
        if (req.user &&
            req.user.role === 'admin') {

            return next();
        }

        logger.info('Administration request attempt failed - "%s"', req.ip + '');

        res.redirect('/?login=failed');
    }

    server.get('/admin', ensureAuthenticated, function (req, res) {
        res.render('admin/index.hbs');
    });

    server.get('/admin/projects', ensureAuthenticated, function (req, res) {
        projectStore.getRecent(
            req.query.page || 0, 
            true,
            function (err, projects) {
                if (err) {
                    routeErrorHandler.handleErrorWithNoOp(err, req, res, logger);
                }

                res.render('admin/projects.hbs', {
                    header: {
                        title: 'Projects',
                        summary: ''
                    },
                    projects: projects || []
                });
            });
    });

    server.get('/admin/project/:projectId', ensureAuthenticated, function (req, res) {
        if (req.params.projectId === 'new') {
            res.render('admin/project.hbs', new Project());
        } else {
            projectStore.getOne(
                {
                    _id: new ObjectId(req.params.projectId)
                }, 
                true,
                function (err, proj) {
                    if (err) {
                        return routeErrorHandler.handleAs500(err, req, res, logger);
                    }

                    if (typeof proj === 'undefined') {
                        return routeErrorHandler.handleAs404(req, res, logger);
                    }

                    res.render('admin/project.hbs', proj);
                });
        }
    });

    server.get('/admin/project/delete/:projectId', ensureAuthenticated, function (req, res) {
        projectStore.deleteOne(
            req.params.projectId, 
            function (err) {
                if (err) {
                    return routeErrorHandler.handleErrorWithNoOp(err, req, res, logger, function (err, req, res) {
                        res.redirect('/admin/projects?error=' + encodeURIComponent(err.message));
                    });
                }

                res.redirect('/admin/projects');
            });
    });

    server.post('/admin/project/:projectId', ensureAuthenticated, urlBodyParser, function (req, res) {
        var b = req.body;
        b._id = b._id ? 
            new ObjectId(b._id) : 
            new ObjectId();

        projectStore.upsertOne(b, function (err) {
            if (err) {
                return routeErrorHandler.handleErrorWithNoOp(err, req, res, logger, function (err, req, res) {
                    res.status(500).json(err);
                });
            }

            res.redirect('/admin/projects');
        });
    });

    server.get('/admin/blogs', ensureAuthenticated, function (req, res) {
        blogStore.getRecent(
            req.query.page || 0, 
            true,
            function (err, blogs) {
                if (err) {
                    return routeErrorHandler.handleAs500(err, req, res, logger);
                }

                res.render('admin/blogs.hbs', {
                    header: {
                        title: 'Blogs',
                        summary: ''
                    },
                    blogs: blogs || []
                });
            });
    });

    server.get('/admin/blog/:blogId', ensureAuthenticated, function (req, res) {
        if (req.params.blogId === 'new') {
            res.render('admin/blog.hbs', new Blog());
        } else {
            blogStore.getOne(
                {
                    _id: new ObjectId(req.params.blogId)
                }, 
                true,
                function (err, blog) {
                    if (err) {
                        return routeErrorHandler.handleAs500(err, req, res, logger);
                    }

                    if (typeof blog === 'undefined') {
                        return routeErrorHandler.handleAs404(req, res, logger);
                    }

                    res.render('admin/blog.hbs', blog);
                });
        }
    });

    server.get('/admin/blog/delete/:blogId', ensureAuthenticated, function (req, res) {
        blogStore.deleteOne(
            req.params.blogId, 
            function (err) {
                if (err) {
                    return routeErrorHandler.handleErrorWithNoOp(err, req, res, logger, function (err, req, res) {
                        res.redirect('/admin/blogs?error=' + encodeURIComponent(err.message));
                    });
                }

                res.redirect('/admin/blogs');
            });
    });

    server.post('/admin/blog/:blogId', ensureAuthenticated, urlBodyParser, function (req, res) {
        var b = req.body;
        b._id = b._id ? 
            new ObjectId(b._id) : 
            new ObjectId();

        blogStore.upsertOne(b, function (err) {
            if (err) {
                return routeErrorHandler.handleErrorWithNoOp(err, req, res, logger, function (err, req, res) {
                    res.status(500).json(err);
                });
            }

            res.redirect('/admin/blogs');
        });
    });
};