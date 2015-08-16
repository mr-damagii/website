module.exports = function (options) {
    this._id = (options || {})._id;

    this.thumbnail = (options || {}).thumbnail;
    this.largeThumbnail = (options || {}).largeThumbnail;

    this.image = (options || {}).image;
    this.largeImage = (options || {}).largeImage;

    this.title = (options || {}).title;
    this.summary = (options || {}).summary;
    this.url = (options || {}).url;
    this.body = (options || {}).body;

    this.created = (options || {}).created;
    this.published = (options || {}).published;
};