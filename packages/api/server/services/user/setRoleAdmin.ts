import userModel from '#server/models/userModel';
import mailsUtils from '#server/mails/mails';
import ServiceError from '#server/errors/ServiceError';
import { modifyUserRoles } from '#server/utils/keycloak/keycloakRolesManagement';
import { User } from '#root/types/resources/User.d';

const { sendAdminWelcome } = mailsUtils;

/**
 * Gère l'attribution du rôle d'administrateur (local) à un utilisateur
 * Il existe 2 sources à mettre à jour:
 * - keycloak pour l'authentification (un admin aura un OTP)
 * - base de données métier pour les droits d'accès
 * @param userId - Id de l'utilisateur
 * @param admin  - True pour octroyer le rôle, false pour le retirer
 * @returns      - L'utilisateur mis à jour
 */
const setRoleAdmin = async (userId: number, admin: boolean) => {
    let user: User | null;

    // 1. Récupération de l'utilisateur en base
    try {
        user = await userModel.findOne(userId);
        if (!user) {
            throw new Error('User not found');
        }
    } catch (error) {
        throw new ServiceError('user_not_found', error);
    }

    // 2. Modification du realm role de l'utilisateur sur keycloak
    try {
        await modifyUserRoles(user, admin);
    } catch (error) {
        throw new ServiceError('keycloak_update_role_failure', error);
    }

    // 3. Modification de l'utilisateur dans la base métier
    try {
        if (user && admin) {
            await userModel.upgradeLocalAdmin(userId);
            if (['active', 'new'].includes(user.status)) {
                await sendAdminWelcome(user);
            }
        } else if (user) {
            await userModel.downgradeLocalAdmin(userId);
        }

        const updatedUser: User = await userModel.findOne(userId);
        return updatedUser;
    } catch (error) {
        throw new ServiceError('update_role_admin_failure', error);
    }
};

export default setRoleAdmin;
