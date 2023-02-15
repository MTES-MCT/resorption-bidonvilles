import ServiceError from '#server/errors/ServiceError';
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
};

export default userService;
