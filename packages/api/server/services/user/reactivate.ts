import { sequelize } from '#db/sequelize';
import { modifyUserRoles } from '#server/utils/keycloak/keycloakRolesManagement';
import reactivate from '#server/models/userModel/reactivate';
import findOneUser from '#server/models/userModel/findOne';
import sendActivationLink from '#server/services/user/sendActivationLink';
import ServiceError from '#server/errors/ServiceError';
import mails from '#server/mails/mails';
import { User } from '#root/types/resources/User.d';

/**
 * Reactiver un utilisateur
 *
 * @param activator - L'utilisateur qui reactive l'utilisateur
 * @param id        - L'id de l'utilisateur à reactiver
 * @returns         - L'utilisateur réactivé
 */
export default async (activator: User, id: number): Promise<User> => {
    const transaction = await sequelize.transaction();

    try {
        await reactivate(id, transaction);
    } catch (error) {
        await transaction.rollback();
        throw new ServiceError('reactivation_failure', error);
    }

    let user: User;
    try {
        user = await findOneUser(id, { extended: true }, null, 'read', transaction);
    } catch (error) {
        await transaction.rollback();
        throw new ServiceError('refresh_failure', error);
    }

    // On réintègre le bon rôle côté Keycloak
    try {
        await modifyUserRoles(user, user.is_admin);
    } catch (error) {
        throw new ServiceError('keycloak_reactivation_failure', error);
    }

    if (user.status === 'active') {
        try {
            await mails.sendUserReactivationAlert(user);
        } catch {
            // DO NOTHING
        }
    } else {
        try {
            await sendActivationLink(activator, user, user.permission_options, transaction);
            user = await findOneUser(id, { extended: true }, null, 'read', transaction);
        } catch (error) {
            await transaction.rollback();
            throw new ServiceError('send_access_failure', error);
        }
    }

    try {
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw new ServiceError('transaction_failure', error);
    }

    return user;
};
