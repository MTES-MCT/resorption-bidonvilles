import userModel from '#server/models/userModel';
import ServiceError from '#server/errors/ServiceError';

export default async (userId, options) => {
    try {
        return await userModel.setPermissionOptions(userId, options);
    } catch (error) {
        throw new ServiceError('insert_failed', error);
    }
};
