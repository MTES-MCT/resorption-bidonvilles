import query from './_common/query';

export default (user, userIds) => query(
    [
        {
            user_id: userIds,
        },
    ],
    { auth: false, extended: false },
    user,
    'list',
);
