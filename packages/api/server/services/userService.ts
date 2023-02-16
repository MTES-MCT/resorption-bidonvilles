import ServiceError from '#server/errors/ServiceError';
import permissionModel from '#server/models/permissionModel';
import { Permissions } from '#server/models/permissionModel/types/Permissions';
import { SerializedUser } from '#server/models/userModel/_common/serializeUser';
import createUser from './createUser';

const userService = {
    async create(data, createdBy = null): Promise<SerializedUser> {
        // insert user into database
        try {
            return await createUser(Object.assign({}, data, {
                created_by: createdBy,
            }));
        } catch (error) {
            throw new ServiceError('db_write', error);
        }
    },

    async getPermissions(userId: number): Promise<Permissions> {
        const hash = await permissionModel.find([userId]);
        return hash[userId] || {};
    },
};

export default userService;
