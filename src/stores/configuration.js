var fs = require('fs');

var config = JSON.parse(
    fs.readFileSync(
        '../config.json'));

var websiteKeyConfig = JSON.parse(
    fs.readFileSync(
        '../.keys/website.json'));

var googleConfig = JSON.parse(
    fs.readFileSync(
        '../.keys/google-auth.json'));

module.exports = {
    main: config,
    keys: {
        website: websiteKeyConfig,
        google: googleConfig.web
    }
};