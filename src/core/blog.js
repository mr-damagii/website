var marked = require('marked');

module.exports = function (options) {
    this._id = (options || {})._id;

    this.header = {
        title: ((options || {}).header || {}).title,
        summary: ((options || {}).header || {}).summary,
        thumbnail: ((options || {}).header || {}).thumbnail,
        largeThumbnail: ((options || {}).header || {}).largeThumbnail
    };

    this.url = (options || {}).url;
    this.image = (options || {}).image;
    this.largeImage = (options || {}).largeImage;
    this.body = (options || {}).body;
    this.created = (options || {}).created;
    this.published = (options || {}).published;
};