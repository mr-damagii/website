module.exports = function (props) {
    var self = this;

    this._id = (props || {})._id;

    this.role = (props || {}).role;

    this.google = {
        id: ((props || {}).google || {}).id,
        token: ((props || {}).google || {}).token,
        email: ((props || {}).google || {}).email,
        name: ((props || {}).google || {}).name,
    };
};