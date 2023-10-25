import { sequelize } from '#db/sequelize';
import userModel from '#server/models/userModel/index';
import { SerializedUser } from '#server/models/userModel/_common/types/SerializedUser.d';
import ServiceError from '#server/errors/ServiceError';
import mails from '#server/mails/mails';
import mattermost from '#server/utils/mattermost';

export default async (id: number, selfDeactivation: boolean, reason: string = null): Promise<SerializedUser> => {
    const transaction = await sequelize.transaction();

    try {
        await userModel.deactivate([id], transaction);
    } catch (error) {
        await transaction.rollback();
        throw new ServiceError('deactivation_failure', error);
    }

    let user;
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
