import query from './_common/query';

export default async (userId, filters = {}, user = null, feature = 'read', transaction = undefined) => {
    const users = await query(
        [{ user_id: { value: [userId] } }],
        filters,
        user,
        feature,
        transaction,
    );

    return users.length === 1 ? users[0] : null;
};
