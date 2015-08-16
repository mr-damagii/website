var projectStore = require('../stores/project');
var routeErrorHandler = require('../utils/routeErrorHandler');

module.exports = function (app, logger) {
    app.get('/projects', function (req, res) {
        projectStore.getRecent(
            req.query.page || 0, 
            false,
            function (err, projects) {
                if (err) {
                    routeErrorHandler.handleErrorWithNoOp(err, req, res, logger);
                }

                res.render('projects.hbs', {
                    pagetitle: 'Projects',
                    header: {
                        title: 'Projects',
                        summary: ''
                    },
                    projects: projects || []
                });
            });
    });

    app.get('/project/:project', function (req, res) {
        projectStore.getOne(
            {
                url: req.params.project
            }, 
            false,
            function (err, proj) {
                if (err) {
                    return routeErrorHandler.handleAs500(err, req, res, logger);
                }

                if (typeof proj === 'undefined') {
                    return routeErrorHandler.handleAs404(req, res, logger);
                }

                proj.pagetitle = proj.title;

                res.render('project.hbs', proj);
            });
    });
};