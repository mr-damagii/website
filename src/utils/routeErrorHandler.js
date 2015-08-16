module.exports = {
    handleAs500: function (err, req, res, logger) {
        logger.error('Error occured at "%s" - \n%s', req.url, err.stack);

        return res.status(500).render('500.hbs', {
            pagetitle: '500 Server Error',
            header: {
                title: '500'
            }
        });
    },
    handleAs404: function (req, res, logger) {
        logger.info('Page not found "%s"', req.url);

        return res.status(404).render('404.hbs', {
            pagetitle: '404 Page Not Found',
            header: {
                title: '404'
            }
        });
    },
    handleErrorWithNoOp: function (err, req, res, logger, cb) {
        logger.error('Error occured at "%s" - \n%s', req.url, err.stack);

        if (typeof cb === 'function') {
            return cb(err, req, res);
        }
    }
};