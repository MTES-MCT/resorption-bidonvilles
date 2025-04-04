import { sequelize } from '#db/sequelize';
import userModel from '#server/models/userModel/index';
import ServiceError from '#server/errors/ServiceError';
import { User } from '#root/types/resources/User.d';

export default async (ids: number[]): Promise<User> => {
    const transaction = await sequelize.transaction();

    try {
        if (ids) {
            await userModel.anonymizationRequest(ids, transaction);
            await transaction.commit();
        }
    } catch (error) {
        await transaction.rollback();
        throw new ServiceError('anonymization_failure', error);
    }

    let user: User;
    try {
        user = await userModel.findOne(ids[0], { extended: true }, null, 'read', null);
    } catch (error) {
        await transaction.rollback();
        throw new ServiceError('refresh_failure', error);
    }
    return user;
};
