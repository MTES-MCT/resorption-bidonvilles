import query from './_common/query';

export default (user, filters = [], feature = 'list', order = undefined) => query(filters, order, user, feature);
