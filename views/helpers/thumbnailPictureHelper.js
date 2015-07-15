module.exports = function (hbs) {

    hbs.registerHelper('thumbnailPicture', function (small, medium, large) {
        
        if (!small) {

            return new hbs.SafeString(
                '<picture>\
                    <source srcset="/client/images/noimage@2x.jpg" media="(-webkit-min-device-pixel-ratio: 4), (min-resolution: 384dpi)" />\
                    <source srcset="/client/images/noimage@1x.jpg" media="(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)" />\
                    <img srcset="/client/images/noimage.jpg" />\
                </picture>'
            );

        }

        var largeHtml = typeof large === 'string' ? 
            '<source srcset="' + large + '" media="(-webkit-min-device-pixel-ratio: 4), (min-resolution: 384dpi)" />' : 
            '';
        var mediumHtml = typeof medium === 'string' ? 
            '<source srcset="' + medium + '" media="(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)" />' : 
            '';
        var smallHtml = typeof small === 'string' ? 
            '<img srcset="' + small + '" />' : 
            '';

        return new hbs.SafeString(
            '<picture>' + 
                largeHtml + 
                mediumHtml + 
                smallHtml + 
            '</picture>'
        );
        
    });

};