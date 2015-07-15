var marked = require('marked');

module.exports = function (hbs) {
    
    hbs.registerHelper('markdown', function (mdString) {
        
        return new hbs.SafeString(
            marked(mdString || ''));
        
    });

};