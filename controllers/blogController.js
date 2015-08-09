var blogService = require('../services/blogService');

var routeErrorHelper = require('../helpers/routeErrorHelper');

module.exports = function (app, logger) {
    app.get('/blogs', function (req, res) {
        blogService.getRecent(
            req.query.page || 0, 
            false,
            function (err, blogs) {
                if (err) {
                    return routeErrorHelper.handleErrorAs500(err, req, res, logger);
                }

                res
                    .status(blogs.length ? 200 : 404)
                    .render('blogs.hbs', {
                        pagetitle: 'Blogs',
                        header: {
                            title: 'Blogs',
                            summary: ''
                        },
                        blogs: blogs || []
                    });
            });
    });

    app.get('/blog/:blog', function (req, res) {
        blogService.getOne(
            {
                url: req.params.blog
            },
            false, 
            function (err, blog) {
                if (err) {
                    return routeErrorHelper.handleErrorAs500(err, req, res, logger);
                }

                if (typeof blog === 'undefined') {
                    return routeErrorHelper.handleErrorAs404(new Error('Blog not found'), req, res, logger);
                }

                blog.pagetitle = blog.title;

                res.render('blog.hbs', blog);
            });
    });
};