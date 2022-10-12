const { trim } = require('validator');

const sanitizers = {
    string(str) {
        return typeof str === 'string' ? trim(str) : null;
    },

    bool(bool) {
        return typeof bool === 'boolean' ? bool : false;
    },

    integer(int) {
        const parsed = parseInt(int, 10);
        return Number.isInteger(parsed) ? parsed : null;
    },

    object(obj) {
        return typeof obj === 'object' ? obj : null;
    },
};

module.exports = function sanitize(data, fields) {
    return fields.reduce((acc, { key, sanitizer }) => Object.assign(acc, {
        [key]: sanitizers[sanitizer](data[key]),
    }), {});
};
