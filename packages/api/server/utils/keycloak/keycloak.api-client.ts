import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { AxiosInstance } from 'axios';
import {
    ClientRepresentation,
    RealmRepresentation,
    UPConfig,
    UserRepresentation,
} from './keycloak-api-types';


export interface AdminCredentials {
    username: string
    password: string
}

export interface UserCredentials {
    username: string
    password: string
    client_id?: string
    client_secret?: string
}

interface TokenResponse {
    access_token: string
}

interface ServiceAccountResponse {
    id: string
}

export interface PublicKeys {
    keys: {
        kid: string
        kty: 'RSA'
        alg: string
        use: string
        n: string
        e: string
        x5c: string[]
        x5t: string
        'x5t#S256': string
    }[]
}

export const KeycloakPublicAxiosInstance = Symbol('KeycloakPublicAxiosInstance');
export const KeycloakAuthenticatedAxiosInstance = Symbol('KeycloakAuthenticatedAxiosInstance');

/**
 * Functional version of the Keycloak API client. Instead of a class, we expose a factory
 * `createKeycloakApi` that receives the required Axios instances and the app config
 * service, and returns a plain object containing async functions that perform the same
 * operations as the original class methods.
 */
export function createKeycloakApi(
    authenticatedInstance: AxiosInstance,
    publicInstance: AxiosInstance,
) {
    const realm = process.env.KEYCLOAK_REALM;
    const realmUrl = `/admin/realms/${realm}`;

    // Helper – builds the Axios config with the bearer token.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function buildConfig(accessToken: string): AxiosRequestConfig {
        return {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        };
    }

    function buildMessage(httpMethod: string, url: string, axiosError: AxiosError<{ errorMessage: string }>): string {
        return `Echec ${httpMethod} ${url} avec le statut ${axiosError.response?.statusText ?? '(pas de code)'} et le détail ${axiosError.response ? JSON.stringify(axiosError.response.data) : 'Pas de message'}`;
    }

    async function post<T>(url: string, body: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        try {
            return await authenticatedInstance.post(url, body, config);
        } catch (e) {
            if (e instanceof AxiosError) {
                const axiosError = e as AxiosError<{ errorMessage: string }>;
                throw new Error(buildMessage('POST', url, axiosError), { cause: e });
            }
            throw e;
        }
    }

    async function deleteRequest<T>(url: string, body: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        try {
            return await authenticatedInstance.delete(url, {
                ...config,
                data: body,
            });
        } catch (e) {
            if (e instanceof AxiosError) {
                const axiosError = e as AxiosError<{ errorMessage: string }>;
                throw new Error(buildMessage('DELETE', url, axiosError), { cause: e });
            }
            throw e;
        }
    }

    async function put<T>(url: string, body: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        try {
            return await authenticatedInstance.put(url, body, config);
        } catch (e) {
            if (e instanceof AxiosError) {
                const axiosError = e as AxiosError<{ errorMessage: string }>;
                throw new Error(buildMessage('PUT', url, axiosError), { cause: e });
            }
            throw e;
        }
    }

    async function get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        try {
            return await authenticatedInstance.get(url, config);
        } catch (e) {
            if (e instanceof AxiosError) {
                const axiosError = e as AxiosError<{ errorMessage: string }>;
                throw new Error(buildMessage('GET', url, axiosError), { cause: e });
            }
            throw e;
        }
    }

    async function getOrUndefinedIf404<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T> | undefined> {
        try {
            return await authenticatedInstance.get(url, config);
        } catch (e) {
            if (e instanceof AxiosError) {
                if (e.response?.status === 404) {
                    return undefined;
                }
                const axiosError = e as AxiosError<{ errorMessage: string }>;
                throw new Error(buildMessage('GET', url, axiosError), { cause: e });
            }
            throw e;
        }
    }

    async function fetchAllUserPages(url: string): Promise<UserRepresentation[]> {
        const allUsers: UserRepresentation[] = [];
        const pageSize = 100;
        let first = 0;
        let current: UserRepresentation[];
        do {
            // eslint-disable-next-line no-await-in-loop
            const response = await get<UserRepresentation[]>(
                `${url}?first=${String(first)}&max=${String(pageSize)}`,
            );
            current = response.data;
            allUsers.push(...current);
            first += pageSize;
        } while (current.length === pageSize);
        return allUsers;
    }

    async function getAdminPublicKey(): Promise<PublicKeys> {
        const response = await publicInstance.get<PublicKeys>('/realms/master/protocol/openid-connect/certs');
        return response.data;
    }

    async function getRealmPublicKey(): Promise<PublicKeys> {
        const response = await publicInstance.get<PublicKeys>(`/realms/${realm}/protocol/openid-connect/certs`);
        return response.data;
    }

    async function getAdminToken(adminCredentials: AdminCredentials): Promise<string> {
        const body = new URLSearchParams({
            grant_type: 'password',
            client_id: 'admin-cli',
            ...adminCredentials,
        });
        const response = await publicInstance.post<TokenResponse>(
            '/realms/master/protocol/openid-connect/token',
            body,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            },
        );
        return response.data.access_token;
    }

    async function getUserToken(userCredentials: UserCredentials): Promise<string> {
        const body = new URLSearchParams({
            grant_type: 'password',
            ...userCredentials,
        });
        const response = await publicInstance.post<TokenResponse>(
            `/realms/${realm}/protocol/openid-connect/token`,
            body,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            },
        );
        return response.data.access_token;
    }

    async function getClientToken(clientId: string, clientSecret: string): Promise<string> {
        const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
        const body = new URLSearchParams({
            grant_type: 'client_credentials',
            audience: clientId,
        });
        const response = await publicInstance.post<TokenResponse>(
            `/realms/${realm}/protocol/openid-connect/token`,
            body,
            {
                headers: {
                    Authorization: `Basic ${authHeader}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            },
        );
        return response.data.access_token;
    }

    async function getServiceAccountId(clientId: string, accessToken: string): Promise<string> {
        const response = await get<ServiceAccountResponse>(
            `${realmUrl}/clients/${clientId}/service-account-user`,
            buildConfig(accessToken),
        );
        return response.data.id;
    }


    async function createRealm(accessToken: string): Promise<void> {
        await post(
            '/admin/realms',
            { realm, enabled: true },
            buildConfig(accessToken),
        );
    }

    async function deleteRealm(accessToken: string): Promise<void> {
        await authenticatedInstance.delete(realmUrl, buildConfig(accessToken));
    }

    async function getUsers(): Promise<UserRepresentation[]> {
        return fetchAllUserPages(`${realmUrl}/users`);
    }

    async function getUnmanagedAttributes(userId: string): Promise<Record<string, string[]> | undefined> {
        const response = await getOrUndefinedIf404<Record<string, string[]>>(
            `${realmUrl}/users/${userId}/unmanagedAttributes`,
        );
        return response?.data;
    }

    async function updateUsersProfileConfig(config: UPConfig, accessToken: string): Promise<void> {
        await put(`${realmUrl}/users/profile`, config, buildConfig(accessToken));
    }

    async function getUsersProfileConfig(accessToken: string): Promise<UPConfig> {
        const response = await get<UPConfig>(`${realmUrl}/users/profile`, buildConfig(accessToken));
        return response.data;
    }

    async function deleteUser(userId: string): Promise<void> {
        await deleteRequest(`${realmUrl}/users/${userId}`, undefined);
    }


    async function createClient(client: ClientRepresentation, accessToken: string): Promise<void> {
        await post(`${realmUrl}/clients`, client, buildConfig(accessToken));
    }

    async function getClients(accessToken: string): Promise<ClientRepresentation[]> {
        const response = await get<ClientRepresentation[]>(`${realmUrl}/clients`, buildConfig(accessToken));
        return response.data;
    }

    async function getClientByClientId(clientId: string, accessToken: string): Promise<ClientRepresentation | undefined> {
        const response = await get<ClientRepresentation[]>(
            `${realmUrl}/clients?clientId=${clientId}`,
            buildConfig(accessToken),
        );
        return response.data[0];
    }

    async function updateClient(clientUuid: string, client: ClientRepresentation, accessToken: string): Promise<void> {
        await authenticatedInstance.put(
            `${realmUrl}/clients/${clientUuid}`,
            client,
            buildConfig(accessToken),
        );
    }

    async function createUser(user: UserRepresentation): Promise<string> {
        const response = await post(`${realmUrl}/users`, user);
        const userLocation = response.headers.location as string;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return userLocation.split('/').pop()!;
    }

    async function updateUser(userId: string, user: UserRepresentation): Promise<void> {
        await put(`${realmUrl}/users/${userId}`, user);
    }

    async function getUserByEmail(email: string): Promise<UserRepresentation | undefined> {
        const response = await get<UserRepresentation[]>(`${realmUrl}/users?email=${email}&exact=true`);
        return response.data[0];
    }

    async function getUserById(id: string): Promise<UserRepresentation | undefined> {
        const response = await getOrUndefinedIf404<UserRepresentation>(`${realmUrl}/users/${id}`);
        return response?.data;
    }


    async function logoutUser(userId: string): Promise<void> {
        await post(`${realmUrl}/users/${userId}/logout`, {});
    }

    async function executeActionsEmail(
        userId: string,
        actions: string[],
        clientId: string,
        redirectUri: string,
    ): Promise<void> {
        await put(
            `${realmUrl}/users/${userId}/execute-actions-email?client_id=${clientId}&redirect_uri=${redirectUri}`,
            actions,
        );
    }


    async function updateRealm(realmData: RealmRepresentation, accessToken: string): Promise<void> {
        await put(realmUrl, realmData, buildConfig(accessToken));
    }

    async function getRealm(accessToken: string): Promise<RealmRepresentation> {
        const response = await get<RealmRepresentation>(realmUrl, buildConfig(accessToken));
        return response.data;
    }

    // Exported API surface – same naming as the original class for easier migration.
    return {
        updateRealm,
        getRealm,
        getAdminPublicKey,
        getRealmPublicKey,
        getAdminToken,
        getUserToken,
        getClientToken,
        getServiceAccountId,
        createRealm,
        deleteRealm,
        getUsers,
        getUnmanagedAttributes,
        updateUsersProfileConfig,
        getUsersProfileConfig,
        deleteUser,
        createClient,
        getClients,
        getClientByClientId,
        updateClient,
        createUser,
        updateUser,
        getUserByEmail,
        getUserById,
        logoutUser,
        executeActionsEmail,
    } as const;
}
