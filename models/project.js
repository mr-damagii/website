module.exports = function (props) {

    this._id = (props || {})._id;

    this.thumbnail = (props || {}).thumbnail;
    this.largeThumbnail = (props || {}).largeThumbnail;

    this.image = (props || {}).image;
    this.largeImage = (props || {}).largeImage;

    this.title = (props || {}).title;
    this.summary = (props || {}).summary;
    this.url = (props || {}).url;
    this.body = (props || {}).body;

    this.created = (props || {}).created;
    this.published = (props || {}).published;

};