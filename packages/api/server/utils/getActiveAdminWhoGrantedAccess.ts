import userModel from '../models/userModel';
import { User } from '#root/types/resources/User.d';
/**
 * Check if the admin who granted access is still active
 *
 * @param {User} user: User - User object with access information
 * @returns {Promise<User|null>} - Returns admin object if active, null otherwise
 */
export default async (user: User): Promise<User | null> => {
    if (user.user_accesses && user.user_accesses.length > 0) {
        const adminId = user.user_accesses[0].sent_by.id;
        const admin = await userModel.findOne(adminId);

        if (admin !== null && admin.status === 'active') {
            return admin;
        }
    }

    return null;
};
