const query = require('./_common/query');

module.exports = user => query([], { auth: false, extended: false }, user, 'list');
