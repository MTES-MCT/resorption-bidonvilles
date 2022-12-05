import query from './_common/query';

export default (user, filters = [], feature = 'list', order = ['shantytowns.updated_at DESC']) => query(user, feature, filters, order);
