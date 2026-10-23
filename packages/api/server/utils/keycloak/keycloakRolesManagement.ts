import { createKeycloakApi } from './keycloak.api-client';
import { User } from '#root/types/resources/User.d';

const ROLES = {
    UTILISATEUR: 'RB_UTILISATEUR',
    ADMINISTRATEUR: 'RB_ADMINISTRATEUR',
} as const;

const ALL_ROLES = Object.values(ROLES);

/**
 * Donne le rôle RB_UTILISATEUR à un utilisateur Keycloak lors de son activation.
 * Ne fait rien si l'utilisateur n'a pas de keycloak_id.
 * @param user  - L'utilisateur à activer.
 * @returns Promise<boolean> - True si l'utilisateur a été activé, false sinon.
 */
export async function activateUser(user: User): Promise<boolean> {
    if (!user.keycloak_id) {
        return false;
    }

    const keycloakApi = await createKeycloakApi();
    await keycloakApi.assignRealmRoles(user.keycloak_id, [ROLES.UTILISATEUR]);
    return true;
}

/**
 * Supprime tous les rôles Keycloak d'un utilisateur désactivé.
 * @param keycloakId  - L'identifiant Keycloak de l'utilisateur à désactiver.
 * @returns Promise<void>
 */
export async function deactivateUser(keycloakId: string): Promise<void> {
    const keycloakApi = await createKeycloakApi();
    await keycloakApi.deleteRealmRoles(keycloakId, ALL_ROLES);
}

/**
 * Met à jour le rôle Keycloak d'un utilisateur (admin ou utilisateur standard).
 * Supprime d'abord tous les rôles existants pour éviter les conflits.
 * @param user - L'utilisateur à mettre à jour.
 * @param isAdmin - True si l'utilisateur doit être admin, false sinon.
 * @returns Promise<void>
 */
export async function modifyUserRoles(user: User, isAdmin: boolean): Promise<void> {
    const keycloakApi = await createKeycloakApi();

    // Suppression préalable de tous les rôles pour partir d'un état propre
    await keycloakApi.deleteRealmRoles(user.keycloak_id, ALL_ROLES);

    const newRole = isAdmin ? ROLES.ADMINISTRATEUR : ROLES.UTILISATEUR;
    await keycloakApi.assignRealmRoles(user.keycloak_id, [newRole]);
}
