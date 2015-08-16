module.exports = function (options) {
    this._id = (options || {})._id;

    this.role = (options || {}).role;

    this.google = {
        id: ((options || {}).google || {}).id,
        token: ((options || {}).google || {}).token,
        email: ((options || {}).google || {}).email,
        name: ((options || {}).google || {}).name
    };
};