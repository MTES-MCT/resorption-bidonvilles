import { sequelize } from '#db/sequelize';
import { createKeycloakApi } from '#server/utils/keycloak/keycloak.api-client';
import userModel from '#server/models/userModel';
import organizationTypeModel from '#server/models/organizationTypeModel';
import authUtils from '#server/utils/auth';
import mattermostUtils from '#server/utils/mattermost';
import ServiceError from '#server/errors/ServiceError';
import { User } from '#root/types/resources/User.d';

const { generateSalt } = authUtils;

/**
 * Créé l'utilisateur demandé en base et dans Keycloak
 * @params data - Données brutes de l'utilisateur à créer
 * @params createdBy - ID de l'utilisateur créateur
 * @returns {Promise<User>}
 */
export default async (data, createdBy: number = null): Promise<User> => {
    let keycloakApi;
    let keycloakId: string;
    try {
        keycloakApi = await createKeycloakApi();

        // 1. On vérifie si l'utilisateur existe déjà dans Keycloak
        const existingUser = await keycloakApi.getUserByEmail(data.email);
        if (existingUser?.id) {
            keycloakId = existingUser.id;
        } else {
            keycloakId = await keycloakApi.createUser({
                username: data.email,
                email: data.email,
                firstName: data.first_name,
                lastName: data.last_name,
                enabled: true,
                emailVerified: false,
            });
        }
        // 2. On donne le rôle de base à l'utilisateur Keycloak
        await keycloakApi.assignRealmRoles(keycloakId, ['RB_UTILISATEUR']);
    } catch (error) {
        throw new ServiceError('keycloak_create_user_failure', error);
    }
    try {
        const userId = await sequelize.transaction(async (t) => {
            const fk_role_regular = await organizationTypeModel.findRoleByOrganizationId(parseInt(data.organization, 10), t);
            Object.assign(data, { fk_role_regular });

            return userModel.create(Object.assign({ ...data, keycloak_id: keycloakId }, {
                created_by: createdBy,
                salt: generateSalt(),
            }), t);
        });

        const user = await userModel.findOne(userId);
        if (user.organization.type.uid === 'rectorat') {
            try {
                await mattermostUtils.triggerNotifyNewUserFromRectorat(user);
            } catch {
                // DO NOTHING
            }
        }

        return user;
    } catch (error) {
        throw new ServiceError('db_write', error);
    }
};
