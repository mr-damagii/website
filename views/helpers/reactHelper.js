var react = require('react');

module.exports = function (hbs) {
    
    hbs.registerHelper('react', function (component, model, target, clean) {
        
        var c = require(
            path.join(
                process.cwd(), 
                'client/components/' + component));

        return new hbs.SafeString(
            '{0}{1}'.replace('{0}', clean ? react.renderToStaticMarkup(react.createElement(c, model)) : react.renderToString(react.createElement(c, model)))
                    .replace('{1}', target && !clean ? '<script>APP_RQ.push({component:\'' + component + '\',model:' + JSON.stringify(model) + ',target:\'' + target + '\'});</script>' : ''));
        
    });

};