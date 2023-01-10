import userModel from '#server/models/userModel';
import permissionsDescription from '#server/permissions_description';
import ServiceError from '#server/errors/ServiceError';

export default async (userId, options) => {
    let user;
    try {
        user = await userModel.findOne(userId);
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }
    const allOptions = permissionsDescription[user.role_id].options;
    const requestedOptions = allOptions
        .filter(({ id }) => options && options.includes(id))
        .map(({ id }) => id);

    try {
        user = await userModel.setPermissionOptions(user.id, requestedOptions, undefined);
    } catch (error) {
        throw new ServiceError('insert_failed', error);
    }


    return user;
};
