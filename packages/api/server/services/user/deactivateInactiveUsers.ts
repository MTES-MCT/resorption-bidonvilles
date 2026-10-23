import mails from '#server/mails/mails';
import userModel from '#server/models/userModel/index';
import { deactivateUser } from '#server/utils/keycloak/keycloakRolesManagement';

/**
 * Désactive les utilisateurs inactifs dans la DB et sur Keycloak, puis leur envoie un mail.
 * @returns Promise<void>
 */
export default async (): Promise<void> => {
    const users = (await userModel.findUsersToBeDeactivated());
    if (users.length === 0) {
        return;
    }

    // 1. Désactivation en DB métier
    await userModel.deactivate(users.map(({ id }) => id), 'auto');
    // 2. Désactivation sur Keycloak et envoie du mail
    await Promise.all(
        users.map(async (user) => {
            await deactivateUser(user.keycloak_id);
            await mails.sendInactiveUserDeactivationAlert(user);
        }),
    );
};
