var marked = require('marked');

module.exports = function (props) {

    var self = this;

    this._id = (props || {})._id;

    this.header = {

        title: ((props || {}).header || {}).title,
        summary: ((props || {}).header || {}).summary,
        thumbnail: ((props || {}).header || {}).thumbnail,
        largeThumbnail: ((props || {}).header || {}).largeThumbnail

    };

    this.url = (props || {}).url;
    this.image = (props || {}).image;
    this.largeImage = (props || {}).largeImage;
    this.body = (props || {}).body;
    this.created = (props || {}).created;
    this.published = (props || {}).published;

};