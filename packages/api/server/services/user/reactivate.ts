import { sequelize } from '#db/sequelize';
import reactivate from '#server/models/userModel/reactivate';
import findOneUser from '#server/models/userModel/findOne';
import ServiceError from '#server/errors/ServiceError';
import mails from '#server/mails/mails';
import { User } from '#root/types/resources/User.d';

export default async (id: number): Promise<User> => {
    const transaction = await sequelize.transaction();

    try {
        await reactivate(id, transaction);
    } catch (error) {
        await transaction.rollback();
        throw new ServiceError('reactivation_failure', error);
    }

    let user: User;
    try {
        user = await findOneUser(id, {}, null, 'read', transaction);
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
