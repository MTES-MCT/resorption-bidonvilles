import userModel from '#server/models/userModel';
import mailsUtils from '#server/mails/mails';
import ServiceError from '#server/errors/ServiceError';
import { createKeycloakApi } from '#server/utils/keycloak/keycloak.api-client';
import { User } from '#root/types/resources/User.d';

const { sendAdminWelcome } = mailsUtils;

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
    console.log('User:', user);
    // 2. Modification du realm role de l'utilisateur sur keycloak
    try {
        const keycloakApi = await createKeycloakApi();
        if (user && admin) {
            console.log('Keycloak API created');
            keycloakApi.assignRealmRoles(user.keycloak_id, ['RB_ADMINISTRATEUR']);
            keycloakApi.deleteRealmRoles(user.keycloak_id, ['RB_UTILISATEUR']);
        } else if (user) {
            keycloakApi.assignRealmRoles(user.keycloak_id, ['RB_UTILISATEUR']);
            keycloakApi.deleteRealmRoles(user.keycloak_id, ['RB_ADMINISTRATEUR']);
        }
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
