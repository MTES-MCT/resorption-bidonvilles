import { createKeycloakApi } from '#server/utils/keycloak/keycloak.api-client';
import buildCredentials from '#server/utils/keycloak/buildCredentials';
import ServiceError from '#server/errors/ServiceError';
import { CredentialRepresentation } from '#server/utils/keycloak/keycloak-api-types';

const activate = async (keycloakId: string, userEmail: string, password: string, salt: string) => {
    // 1. On hash le password + salt pour que Keycloak les accepte
    const passwordHash: CredentialRepresentation[] = buildCredentials(password, salt);

    // 2. On active l'utilisateur sur Keycloak
    try {
        const keycloakApi = await createKeycloakApi();
        await keycloakApi.updateUser(keycloakId, {
            email: userEmail,
            emailVerified: true,
            credentials: passwordHash,
        });
    } catch (error) {
        throw new ServiceError('keycloak_update_user_failure', error);
    }
};

export default activate;
