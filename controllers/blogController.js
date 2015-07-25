var blogService = require('../services/blogService');

module.exports = function (app) {
    app.get('/blogs', function (req, res) {
        blogService.getRecent(
            req.query.page || 0, 
            false,
            function (err, blogs) {
                res
                    .status(blogs.length ? 200 : 404)
                    .render('blogs.hbs', {
                        pagetitle: 'Blogs',
                        header: {
                            title: 'Blogs',
                            summary: ''
                        },
                        blogs: blogs
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
                    throw err;

                    return;
                }

                blog.pagetitle = blog.title;

                res.render('blog.hbs', blog);
            });
    });
};