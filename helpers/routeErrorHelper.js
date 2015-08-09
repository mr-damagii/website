module.exports = {
    handleErrorAs500: function (err, req, res, logger) {
        logger.error('Error occured at "%s" - %j', req.url, err);

        res.redirect('/500');
    },
    handleErrorAs404: function (err, req, res, logger) {
        logger.error('Page not found "%s" - %j', req.url, err);

        res.redirect('/404');
    },
    handleErrorNoOp: function (err, req, res, logger, cb) {
        logger.error('Page not found "%s" - %j', req.url, err);

        if (typeof cb === 'function') {
            cb(err, req, res);
        }
    }
};