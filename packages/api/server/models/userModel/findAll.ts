import query from './_common/query';

export default (user, where = []) => query(where, { auth: false, extended: false }, user, 'list');
