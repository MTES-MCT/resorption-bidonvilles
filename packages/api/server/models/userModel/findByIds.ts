import query from './_common/query';

const findByIds = (user, userIds) => query(
    [
        {
            user_id: userIds,
        },
        {
            anonymized_at: { value: null },
        },
    ],
    { auth: false, extended: false },
    user,
    'list',
);

export default findByIds;
