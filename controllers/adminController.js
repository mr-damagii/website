var ObjectId = require('mongodb').ObjectID;
var urlBodyParser = require('body-parser').urlencoded();

var Project = require('../models/project');
var Blog = require('../models/blog');
var projectService = require('../services/projectService')();
var blogService = require('../services/blogService')();

module.exports = function (app) {

    app.get('/admin', function (req, res) {

        res.render('admin/index.hbs');

    });

    app.get('/admin/projects', function (req, res) {

        projectService.getRecent(
            req.query.page || 0, 
            true,
            function (err, projects) {

                res.render('admin/projects.hbs', {

                    header: {

                        title: 'Projects',
                        summary: ''

                    },


                    projects: projects

                });

            });

    });

    app.get('/admin/project/:projectId', function (req, res) {

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

                        throw err;

                        return;

                    }

                    res.render('admin/project.hbs', proj);

                });

        }

    });

    app.get('/admin/project/delete/:projectId', function (req, res) {

        projectService.deleteOne(
            req.params.projectId, 
            function (err) {

                res.redirect('/admin/projects');

            });

    });

    app.post('/admin/project/:projectId', urlBodyParser, function (req, res) {

        var b = req.body;
        b._id = b._id ? 
            new ObjectId(b._id) : 
            new ObjectId();

        projectService.upsertOne(b, function (err) {

            res.redirect('/admin/projects');

        });

    });

    app.get('/admin/blogs', function (req, res) {

        blogService.getRecent(
            req.query.page || 0, 
            true,
            function (err, blogs) {

                res.render('admin/blogs.hbs', {

                    header: {

                        title: 'Blogs',
                        summary: ''

                    },


                    blogs: blogs

                });

            });

    });

    app.get('/admin/blog/:blogId', function (req, res) {

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

                        throw err;

                        return;

                    }

                    res.render('admin/blog.hbs', blog);

                });

        }

    });

    app.get('/admin/blog/delete/:blogId', function (req, res) {

        blogService.deleteOne(
            req.params.blogId, 
            function (err) {

                res.redirect('/admin/blogs');

            });

    });

    app.post('/admin/blog/:blogId', urlBodyParser, function (req, res) {

        var b = req.body;
        b._id = b._id ? 
            new ObjectId(b._id) : 
            new ObjectId();

        blogService.upsertOne(b, function (err) {

            res.redirect('/admin/blogs');

        });

    });
    
};