var projectService = require('../services/projectService')();

module.exports = function (app) {

    app.get('/projects', function (req, res) {

        projectService.getRecent(
            req.query.page || 0, 
            false,
            function (err, projects) {

                res
                    .status(projects.length ? 200 : 404)
                    .render('projects.hbs', {

                        pagetitle: 'Projects',


                        header: {

                            title: 'Projects',
                            summary: ''

                        },


                        projects: projects

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

                    throw err;

                    return;

                }

                proj.pagetitle = proj.title;

                res.render('project.hbs', proj);

            });

    });
    
};