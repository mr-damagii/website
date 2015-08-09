var projectService = require('../services/projectService')

var routeErrorHelper = require('../helpers/routeErrorHelper');

module.exports = function (app, logger) {
    app.get('/projects', function (req, res) {
        projectService.getRecent(
            req.query.page || 0, 
            false,
            function (err, projects) {
                if (err) {
                    return routeErrorHelper.handleErrorAs500(err, req, res, logger);
                }

                res
                    .status(projects.length ? 200 : 404)
                    .render('projects.hbs', {
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
        projectService.getOne(
            {
                url: req.params.project
            }, 
            false,
            function (err, proj) {
                if (err) {
                    return routeErrorHelper.handleErrorAs500(err, req, res, logger);
                }

                if (typeof proj === 'undefined') {
                    return routeErrorHelper.handleErrorAs404(new Error('Project not found'), req, res, logger);
                }

                proj.pagetitle = proj.title;

                res.render('project.hbs', proj);
            });
    });
};