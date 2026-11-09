import { createKeycloakApi } from '#server/utils/keycloak/keycloak.api-client';
import buildCredentials from '#server/utils/keycloak/buildCredentials';
import ServiceError from '#server/errors/ServiceError';
import { CredentialRepresentation } from '#server/utils/keycloak/keycloak-api-types';

/**
 * @param keycloakId - {string} L'identifiant de l'utilisateur sur Keycloak
 * @param userEmail  - {string} L'email de l'utilisateur
 * @param password   - {string} Le mot de passe de l'utilisateur
 * @param salt       - {string} Le sel de l'utilisateur
 */
const activate = async (keycloakId: string, userEmail: string, password: string, salt?: string): Promise<void> => {
    // 1. On hash le password + salt si un salt est fourni
    let passwordHash: CredentialRepresentation[] | undefined;
    if (salt) {
        passwordHash = buildCredentials(password, salt);
    }

    // 2. On active l'utilisateur sur Keycloak
    try {
        const keycloakApi = await createKeycloakApi();
        await keycloakApi.updateUser(keycloakId, {
            email: userEmail,
            emailVerified: true,
            ...(salt && { credentials: passwordHash }),
        });
    } catch (error) {
        throw new ServiceError('keycloak_update_user_failure', error);
    }

    // 3. On met à jour le mot de passe
    try {
        const keycloakApi = await createKeycloakApi();
        await keycloakApi.resetPassword(keycloakId, password);
    } catch (error) {
        throw new ServiceError('keycloak_reset_password_failure', error);
    }
};

export default activate;
