const query = require('./_common/query');

module.exports = (user, filters = [], feature = 'list', order = ['shantytowns.updated_at DESC']) => query(filters, order, user, feature);
