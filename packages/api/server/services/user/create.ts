import { sequelize } from '#db/sequelize';
import axios from 'axios';
import { createKeycloakApi } from '#server/utils/keycloak/keycloak.api-client';
import userModel from '#server/models/userModel';
import organizationTypeModel from '#server/models/organizationTypeModel';
import authUtils from '#server/utils/auth';
import mattermostUtils from '#server/utils/mattermost';
import ServiceError from '#server/errors/ServiceError';
import { User } from '#root/types/resources/User.d';

const { generateSalt } = authUtils;

export default async (data, createdBy: number = null): Promise<User> => {
    let keycloakApi;
    let keycloakId: string;
    try {
        const KEYCLOAK_BASE_URL = process.env.RB_API_KEYCLOAK_URL ?? 'http://localhost:8080';
        const PISTE_URL = process.env.RB_API_PISTE_URL ?? 'https://sandbox-api.piste.gouv.fr';

        const publicAxios = axios.create({ baseURL: KEYCLOAK_BASE_URL });
        const adminAxios = axios.create({ baseURL: PISTE_URL });

        keycloakApi = await createKeycloakApi(adminAxios, publicAxios);

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
                emailVerified: true,
            // credentials: buildCredentials(data.password, data.salt),
            });
        }
        console.log('Keycloak ID: ', keycloakId);
        // 2. On donne le rôle de base à l'utilisateur Keycloak
        await keycloakApi.assignRealmRoles(keycloakId, ['RB_UTILISATEUR']);
    } catch (error) {
        console.error('error: ', error);
        throw error;
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
