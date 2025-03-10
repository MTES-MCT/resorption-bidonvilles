import { sequelize } from '#db/sequelize';
import userModel from '#server/models/userModel/index';
import ServiceError from '#server/errors/ServiceError';
import mails from '#server/mails/mails';
import mattermost from '#server/utils/mattermost';
import { User } from '#root/types/resources/User.d';

export default async (id: number, selfDeactivation: boolean, reason: string = null, anonymizationRequested: boolean = false): Promise<User> => {
    const transaction = await sequelize.transaction();

    try {
        await userModel.deactivate([id], 'admin', anonymizationRequested, transaction);
    } catch (error) {
        await transaction.rollback();
        throw new ServiceError('deactivation_failure', error);
    }

    let user: User;
    try {
        user = await userModel.findOne(id, {}, null, 'deactivate', transaction);
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

    if (selfDeactivation) {
        try {
            await Promise.all([
                mails.sendUserDeactivationConfirmation(user),
                mattermost.triggerNotifyNewUserSelfDeactivation(user),
            ]);
        } catch (error) {
            // ignore
        }
    } else {
        try {
            await mails.sendUserDeactivationByAdminAlert(user, {
                variables: {
                    reason: reason || 'Aucune raison mentionnée',
                },
            });
        } catch (error) {
            // ignore
        }
    }

    return user;
};
