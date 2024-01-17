import sequelize from '#db/config/sequelize';
import setPermissionOptions from '#server/models/userModel/setPermissionOptions';
import findSingleUser from '#server/models/userModel/findOne';
import createUserAccess from '#server/models/userAccessModel/create';
import accessRequestService from '#server/services/accessRequest/accessRequestService';
import authUtils from '#server/utils/auth';
import ServiceError from '#server/errors/ServiceError';
import { Transaction } from 'sequelize';
import { User } from '#root/types/resources/User.d';

const { getExpiracyDateForActivationTokenCreatedAt } = authUtils;

export default async (activator: User, user: User, options: string[] = [], argTransaction?: Transaction): Promise<User> => {
    const transaction = argTransaction || await sequelize.transaction();
    let refreshedUser: User;

    try {
        // on met à jour les options de l'utilisateur
        await setPermissionOptions(user.id, options, transaction);

        // on crée les accès
        const now = new Date();
        const expiresAt = getExpiracyDateForActivationTokenCreatedAt(now);
        const userAccessId = await createUserAccess({
            fk_user: user.id,
            sent_by: activator.id,
            created_at: now,
            expires_at: expiresAt,
        }, transaction);

        // on remet à zéro les mails planifiés de relance pour cet utilisateur
        await accessRequestService.resetRequestsForUser(user);
        await accessRequestService.handleAccessRequestApproved(
            user,
            {
                id: userAccessId,
                expires_at: expiresAt.getTime() / 1000,
                sent_by: activator,
            },
        );

        // refresh the user
        refreshedUser = await findSingleUser(user.id, undefined, undefined, undefined, transaction);

        // on commit la transaction
        if (argTransaction === undefined) {
            await transaction.commit();
        }
    } catch (error) {
        if (argTransaction === undefined) {
            await transaction.rollback();
        }

        throw new ServiceError('generic_failure', error);
    }

    return refreshedUser;
};
