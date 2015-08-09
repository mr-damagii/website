var ObjectId = require('mongodb').ObjectID;
var urlBodyParser = require('body-parser').urlencoded();

var Project = require('../models/project');
var Blog = require('../models/blog');
var projectService = require('../services/projectService');
var blogService = require('../services/blogService');

var routeErrorHelper = require('../helpers/routeErrorHelper');

module.exports = function (app, logger) {
    function ensureAuthenticated(req, res, next) {
        if (req.user &&
            req.user.role === 'admin') {

            return next();
        }

        logger.info('Administration request attempt failed - "%s"', req.ip + '');

        res.redirect('/?login=failed');
    }

    app.get('/admin', ensureAuthenticated, function (req, res) {
        res.render('admin/index.hbs');
    });

    app.get('/admin/projects', ensureAuthenticated, function (req, res) {
        projectService.getRecent(
            req.query.page || 0, 
            true,
            function (err, projects) {
                if (err) {
                    routeErrorHelper.handleErrorNoOp(err, req, res, logger);
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

    app.get('/admin/project/:projectId', ensureAuthenticated, function (req, res) {
        if (req.params.projectId === 'new') {
            res.render('admin/project.hbs', new Project());
        } else {
            projectService.getOne(
                {
                    _id: new ObjectId(req.params.projectId)
                }, 
                true,
                function (err, proj) {
                    if (err) {
                        return routeErrorHelper.handleErrorAs500(err, req, res, logger);
                    }

                    if (typeof proj === 'undefined') {
                        return routeErrorHelper.handleErrorAs404(new Error('Project not found'), req, res, logger);
                    }

                    res.render('admin/project.hbs', proj);
                });
        }
    });

    app.get('/admin/project/delete/:projectId', ensureAuthenticated, function (req, res) {
        projectService.deleteOne(
            req.params.projectId, 
            function (err) {
                if (err) {
                    return routeErrorHelper.handleErrorNoOp(err, req, res, logger, function (err, req, res) {
                        res.redirect('/admin/projects?error=' + encodeURIComponent(err.message));
                    });
                }

                res.redirect('/admin/projects');
            });
    });

    app.post('/admin/project/:projectId', ensureAuthenticated, urlBodyParser, function (req, res) {
        var b = req.body;
        b._id = b._id ? 
            new ObjectId(b._id) : 
            new ObjectId();

        projectService.upsertOne(b, function (err) {
            if (err) {
                return routeErrorHelper.handleErrorNoOp(err, req, res, logger, function (err, req, res) {
                    res.status(500).json(err);
                });
            }

            res.redirect('/admin/projects');
        });
    });

    app.get('/admin/blogs', ensureAuthenticated, function (req, res) {
        blogService.getRecent(
            req.query.page || 0, 
            true,
            function (err, blogs) {
                if (err) {
                    return routeErrorHelper.handleErrorAs500(err, req, res, logger);
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

    app.get('/admin/blog/:blogId', ensureAuthenticated, function (req, res) {
        if (req.params.blogId === 'new') {
            res.render('admin/blog.hbs', new Blog());
        } else {
            blogService.getOne(
                {
                    _id: new ObjectId(req.params.blogId)
                }, 
                true,
                function (err, blog) {
                    if (err) {
                        return routeErrorHelper.handleErrorAs500(err, req, res, logger);
                    }

                    if (typeof blog === 'undefined') {
                        return routeErrorHelper.handleErrorAs404(new Error('Blog not found'), req, res, logger);
                    }

                    res.render('admin/blog.hbs', blog);
                });
        }
    });

    app.get('/admin/blog/delete/:blogId', ensureAuthenticated, function (req, res) {
        blogService.deleteOne(
            req.params.blogId, 
            function (err) {
                if (err) {
                    return routeErrorHelper.handleErrorNoOp(err, req, res, logger, function (err, req, res) {
                        res.redirect('/admin/blogs?error=' + encodeURIComponent(err.message));
                    });
                }

                res.redirect('/admin/blogs');
            });
    });

    app.post('/admin/blog/:blogId', ensureAuthenticated, urlBodyParser, function (req, res) {
        var b = req.body;
        b._id = b._id ? 
            new ObjectId(b._id) : 
            new ObjectId();

        blogService.upsertOne(b, function (err) {
            if (err) {
                return routeErrorHelper.handleErrorNoOp(err, req, res, logger, function (err, req, res) {
                    res.status(500).json(err);
                });
            }

            res.redirect('/admin/blogs');
        });
    });
};