var blogStore = require('../stores/blog');
var routeErrorHandler = require('../utils/routeErrorHandler');

module.exports = function (app, logger) {
    app.get('/blogs', function (req, res) {
        blogStore.getRecent(
            req.query.page || 0, 
            false,
            function (err, blogs) {
                if (err) {
                    routeErrorHandler.handleErrorWithNoOp(err, req, res, logger);
                }

                res.render('blogs.hbs', {
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
        blogStore.getOne(
            {
                url: req.params.blog
            },
            false, 
            function (err, blog) {
                if (err) {
                    return routeErrorHandler.handleAs500(err, req, res, logger);
                }

                if (typeof blog === 'undefined') {
                    return routeErrorHandler.handleAs404(req, res, logger);
                }

                blog.pagetitle = blog.title;

                res.render('blog.hbs', blog);
            });
    });
};