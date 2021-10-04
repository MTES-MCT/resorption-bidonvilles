const query = require('./_common/query');

module.exports = async (userAccessId, filters = {}) => {
    const users = await query(
        [
            {
                userAccessId: {
                    query: 'last_user_accesses.user_access_id',
                    value: [userAccessId],
                },
            },
        ],
        filters,
    );

    return users.length === 1 ? users[0] : null;
};
