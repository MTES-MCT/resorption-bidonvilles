const query = require('./_common/query');

module.exports = async (userId, filters = {}, user = null, feature = 'read') => {
    const users = await query(
        [{ user_id: [userId] }],
        filters,
        user,
        feature,
    );

    return users.length === 1 ? users[0] : null;
};
