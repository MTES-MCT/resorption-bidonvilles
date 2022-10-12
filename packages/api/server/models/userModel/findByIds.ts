const query = require('./_common/query');

module.exports = (user, userIds) => query(
    [
        {
            user_id: userIds,
        },
    ],
    { auth: false, extended: false },
    user,
    'list',
);
