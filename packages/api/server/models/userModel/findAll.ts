import query from './_common/query';

export default (user, where = [], filters = { auth: false, extended: false }) => query(where, filters, user, 'list');
