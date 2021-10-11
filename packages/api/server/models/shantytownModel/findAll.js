const query = require('./_common/query');

module.exports = (user, filters = [], feature = 'list', order = undefined) => query(filters, order, user, feature);
