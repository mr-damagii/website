module.exports = function (hbs) {
    
    hbs.registerHelper('if_even', function (conditional, options) {
        
        return conditional % 2 === 0 ? 
            options.fn(this) : 
            options.inverse(this);
        
    });

};