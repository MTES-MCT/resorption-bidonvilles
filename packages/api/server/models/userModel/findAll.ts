const query = require('./_common/query');

module.exports = (user, where = []) => query(where, { auth: false, extended: false }, user, 'list');
