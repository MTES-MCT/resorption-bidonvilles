import { sequelize } from '#db/sequelize';
import userModel from '#server/models/userModel/index';
import ServiceError from '#server/errors/ServiceError';
import mails from '#server/mails/mails';
import { User } from '#root/types/resources/User.d';

export default async (id: number): Promise<User> => {
    const transaction = await sequelize.transaction();

    try {
        await userModel.reactivate(id, transaction);
    } catch (error) {
        await transaction.rollback();
        throw new ServiceError('reactivation_failure', error);
    }

    let user: User;
    try {
        user = await userModel.findOne(id, {}, null, 'read', transaction);
    } catch (error) {
        await transaction.rollback();
        throw new ServiceError('refresh_failure', error);
    }

    try {
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw new ServiceError('transaction_failure', error);
    }

    if (user.status === 'active') {
        try {
            await mails.sendUserReactivationAlert(user);
        } catch (error) {
            // ignore
        }
    }

    return user;
};
