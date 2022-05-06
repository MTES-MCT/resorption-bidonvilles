import query from './_common/query';

export default user => query([], { auth: false, extended: false }, user, 'list');
