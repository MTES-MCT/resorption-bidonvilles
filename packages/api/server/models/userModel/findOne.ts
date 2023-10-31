import query from './_common/query';
import { User } from '#root/types/resources/User.d';

export default async (userId, filters = {}, user = null, feature = 'read', transaction = undefined): Promise<User> => {
    const users = await query(
        [{ user_id: { value: [userId] } }],
        filters,
        user,
        feature,
        transaction,
    );

    return users.length === 1 ? users[0] : null;
};
