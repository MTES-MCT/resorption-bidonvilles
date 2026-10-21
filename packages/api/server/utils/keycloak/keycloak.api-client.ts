import axios, {
    AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig,
} from 'axios';
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
 * Fournisseurs de tokens injectés dans les intercepteurs Axios.
 * Chaque callback est appelé une première fois (lazy), puis à nouveau si un 401
 * est reçu (invalidation du cache côté appelant).
 */
export interface TokenProviders {
    /** Renvoie un token valide pour l'en-tête X-Admin-Token (Keycloak). */
    getAdminToken: () => Promise<string>;
    /** Renvoie un Bearer token valide pour l'API Piste. */
    getPisteToken: () => Promise<string>;
}

const KEYCLOAK_BASE_URL = process.env.RB_API_KEYCLOAK_URL ?? 'https://keycloak.resorption-bidonvilles.localhost';
const PISTE_URL = process.env.RB_API_PISTE_URL ?? 'https://keycloak.resorption-bidonvilles.localhost/auth';

/**
 * Functional version of the Keycloak API client. Instead of a class, we expose a factory
 * `createKeycloakApi` that receives the required Axios instances and the app config
 * service, and returns a plain object containing async functions that perform the same
 * operations as the original class methods.
 *
 * @param authenticatedInstance - Instance Axios pour les appels admin.
 * @param publicInstance        - Instance Axios pour les appels publics (tokens, certs).
 * @param tokenProviders        - Optionnel. Fournisseurs de tokens admin Keycloak et Piste.
 *                                Quand fournis, les tokens sont injectés automatiquement
 *                                dans chaque requête via des intercepteurs et rafraîchis
 *                                en cas de réponse 401.
 */
export async function createKeycloakApi(
    rawAuthenticatedInstance?: AxiosInstance,
    rawPublicInstance?: AxiosInstance,
    tokenProviders?: TokenProviders,
) {
    const realm = process.env.KEYCLOAK_REALM;
    const realmUrl = `/admin/realms/${realm}`;

    const publicInstance = rawPublicInstance ?? axios.create({ baseURL: KEYCLOAK_BASE_URL });
    const authenticatedInstance = rawAuthenticatedInstance ?? axios.create({ baseURL: PISTE_URL });
    console.log('baseURL publicInstance:', publicInstance.defaults.baseURL);
    console.log('authInstance:', authenticatedInstance.defaults.baseURL);

    // -------------------------------------------------------------------------
    // Gestion interne des tokens (cache vivant dans la closure de l'instance)
    // -------------------------------------------------------------------------

    // Cache admin Keycloak — persistant entre tous les appels de cette instance.
    let cachedAdminToken: string | null = null;

    // Récupère un nouveau token admin Keycloak et le stocke dans le cache.
    // Ne doit être appelé que lorsque le cache est null (premier appel ou après un 401).
    async function fetchAdminToken(): Promise<string> {
        const adminClientId = process.env.RB_API_KEYCLOAK_BACK_CLIENT_ADMIN ?? 'rb-admin';
        const adminClientSecret = process.env.RB_API_KEYCLOAK_BACK_CLIENT_ADMIN_SECRET;
        const params = new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: adminClientId,
            ...(adminClientSecret ? { client_secret: adminClientSecret } : {}),
            scope: 'openid',
        });
        console.log(`🔑 fetchAdminToken pour ${adminClientId} du realm ${realmUrl} avec en params ${params}`);
        try {
            const response = await publicInstance.post<TokenResponse>(
                `/auth/realms/${realm}/protocol/openid-connect/token`,
                params,
                { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
            );
            console.log('  && response.data: ', response.data);


            // On ne stocke dans le cache QU'APRÈS un fetch réussi.
            cachedAdminToken = response.data.access_token;
            return cachedAdminToken;
        } catch (err) {
            console.error('  && Erreur fetchAdminToken: ', err);
            throw err;
        }
    }

    async function resolveAdminToken(): Promise<string> {
        console.log('  && Vérification du CachedAdminToken', cachedAdminToken);
        if (tokenProviders) {
            return tokenProviders.getAdminToken();
        }
        // Retourne le token en cache s'il est encore valide, sinon en récupère un nouveau.
        return cachedAdminToken ?? fetchAdminToken();
    }

    // Cache token PISTE — persistant entre tous les appels de cette instance.
    let cachedPisteToken: string | null = null;

    // Récupère un nouveau token PISTE et le stocke dans le cache.
    async function fetchPisteToken(): Promise<string> {
        const pisteClientId = process.env.RB_API_PISTE_CLIENT_ID;
        const pisteClientSecret = process.env.RB_API_PISTE_CLIENT_SECRET;
        const pisteOauthUrl = process.env.RB_API_PISTE_OAUTH_URL ?? 'https://sandbox-oauth.piste.gouv.fr';

        if (!pisteClientId || !pisteClientSecret) {
            throw new Error('Variables RB_API_PISTE_CLIENT_ID ou RB_API_PISTE_CLIENT_SECRET manquantes');
        }
        const params = new URLSearchParams({
            grant_type: 'client_credentials',
            scope: 'openid',
            client_id: pisteClientId,
            client_secret: pisteClientSecret,
        });
        const response = await publicInstance.post<TokenResponse>(
            `${pisteOauthUrl}/api/oauth/token`,
            params,
        );
        // On ne stocke dans le cache QU'APRÈS un fetch réussi.
        cachedPisteToken = response.data.access_token;
        return cachedPisteToken;
    }

    async function resolvePisteToken(): Promise<string> {
        if (tokenProviders) {
            return tokenProviders.getPisteToken();
        }
        return cachedPisteToken ?? fetchPisteToken();
    }


    // -------------------------------------------------------------------------
    // Intercepteurs Axios : injectent les tokens sur chaque requête authentifiée
    // et invalident le cache + réessaient une fois en cas de 401.
    // -------------------------------------------------------------------------
    authenticatedInstance.interceptors.request.use(
        async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
            const [adminToken, pisteToken] = await Promise.all([
                resolveAdminToken(),
                resolvePisteToken(),
            ]);

            // eslint-disable-next-line no-param-reassign
            config.headers = config.headers ?? {} as typeof config.headers;
            // eslint-disable-next-line no-param-reassign
            config.headers.Authorization = `Bearer ${pisteToken}`;
            // eslint-disable-next-line no-param-reassign
            config.headers.ENVIRONNEMENT = 'PREPROD';
            // eslint-disable-next-line no-param-reassign
            config.headers['X-Admin-Token'] = adminToken;
            if (!config.headers['Content-Type']) {
                // eslint-disable-next-line no-param-reassign
                config.headers['Content-Type'] = 'application/json';
            }

            return config;
        },
    );

    authenticatedInstance.interceptors.response.use(
        response => response,
        async (error: unknown) => {
            if (error instanceof AxiosError && error.response?.status === 401) {
                const originalRequest = error.config as (typeof error.config & { retried?: boolean });
                if (originalRequest && !originalRequest.retried) {
                    originalRequest.retried = true;

                    // Invalider les caches internes et forcer un nouveau fetch.
                    // if (!tokenProviders) {
                    //     cachedAdminToken = null;
                    //     cachedPisteToken = null;
                    // }

                    // const [adminToken, pisteToken] = await Promise.all([
                    //     resolveAdminToken(),
                    //     resolvePisteToken(),
                    // ]);

                    // originalRequest.headers = originalRequest.headers ?? {} as typeof originalRequest.headers;
                    // originalRequest.headers.Authorization = `Bearer ${pisteToken}`;
                    // originalRequest.headers['X-Admin-Token'] = adminToken;

                    return authenticatedInstance.request(originalRequest);
                }
            }
            return Promise.reject(error);
        },
    );


    // Helper – builds the Axios config with the bearer token.
    // Conservé pour la compatibilité avec les méthodes qui passent encore un token explicitement.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function buildConfig(accessToken: string, pisteAccessToken?: string): AxiosRequestConfig {
        return {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${pisteAccessToken}`,
                'X-Admin-Token': accessToken,
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
            console.log('🎯    ## GETTING:', url);

            return await authenticatedInstance.get(url, config);
        } catch (e) {
            if (e instanceof AxiosError) {
                console.log('### ERROR!', e);

                const axiosError = e as AxiosError<{ errorMessage: string }>;
                throw new Error(buildMessage('GET', url, axiosError), { cause: e });
            }
            throw e;
        }
    }

    async function healthcheck(): Promise<AxiosResponse> {
        console.log('👨‍⚕️    Testing health check');
        let healthResponse: AxiosResponse;
        try {
            healthResponse = await authenticatedInstance.get('/healthcheck');
            // console.log('### Healthcheck:', healthResponse);
            return healthResponse.data;
        } catch (e) {
            console.log('### Healthcheck Error:', e);
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
        const pageSize = 500;
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
        console.log(`Found ${allUsers.length} users`);
        // throw new Error('STOP après users');
        return allUsers;
    }

    async function getAdminPublicKey(): Promise<PublicKeys> {
        const response = await publicInstance.get<PublicKeys>(`/auth/realms/${realm}/protocol/openid-connect/certs`);
        return response.data;
    }

    async function getRealmPublicKey(): Promise<PublicKeys> {
        const response = await publicInstance.get<PublicKeys>(`/auth/realms/${realm}/protocol/openid-connect/certs`);
        return response.data;
    }

    async function getAdminToken(adminCredentials: AdminCredentials): Promise<string> {
        const body = new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: 'rb-admin',
            ...adminCredentials,
        });
        // https://preprod.sisiao.dihal.gouv.fr/auth/realms/SISIAO/protocol/openid-connect/token
        // https://preprod.sisiao.dihal.gouv.fr/auth/realms/SISIAO/protocol/openid-connect/token
        // console.log('admin request', body);
        const response = await publicInstance.post<TokenResponse>(
            `/auth/realms/${realm}/protocol/openid-connect/token`,
            body,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            },
        );
        // console.log('admin response', response.data.access_token);
        return response.data.access_token;
    }

    async function getUserToken(userCredentials: UserCredentials): Promise<string> {
        const body = new URLSearchParams({
            grant_type: 'password',
            ...userCredentials,
        });
        const response = await publicInstance.post<TokenResponse>(
            `/auth/realms/${realm}/protocol/openid-connect/token`,
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
            `/auth/realms/${realm}/protocol/openid-connect/token`,
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
        // https://sandbox-api.piste.gouv.fr/dihal/sisiao/connect/v1/admin/realms/SISIAO/users
        return fetchAllUserPages(`${realmUrl}/users`);
        // let response:UserRepresentation[];
        // if (pages) {
        //     const users = await fetchAllUserPages(`${realmUrl}/users`);
        //     response = users;
        // } else {
        //     const users = await get<UserRepresentation[]>(`${realmUrl}/users`);
        //     response = users.data;
        // }
        // return response;
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
        console.log('============= Creating USER! ===============');

        const response = await post(`${realmUrl}/users`, user);
        const userLocation = response.headers.location as string;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return userLocation.split('/').pop()!;
    }

    async function updateUser(userId: string, user: UserRepresentation): Promise<void> {
        await put(`${realmUrl}/users/${userId}`, user);
    }

    async function getUserByEmail(email: string): Promise<UserRepresentation | undefined> {
        console.log(`## Getting user by EMAIL /${realmUrl}/users?email=${email}&exact=true`);

        const response = await get<UserRepresentation[]>(`${realmUrl}/users?email=${email}&exact=true`);
        console.log('Respones:', response?.data[0]);
        return response.data[0];
    }

    async function getUserById(id: string): Promise<UserRepresentation | undefined> {
        const response = await getOrUndefinedIf404<UserRepresentation>(`${realmUrl}/users/${id}`);
        return response?.data;
    }

    async function getRoleRepresentations(roleNames: string[]): Promise<{ id: string; name: string }[]> {
        return Promise.all(
            roleNames.map(async (roleName) => {
                const roleResponse = await get<{ id: string; name: string }>(
                    `${realmUrl}/roles/${encodeURIComponent(roleName)}`,
                );
                return roleResponse.data;
            }),
        );
    }

    async function logoutUser(userId: string): Promise<void> {
        await post(`${realmUrl}/users/${userId}/logout`, {});
    }

    /**
     * Assigns realm-level roles to a user.
     *
     * Keycloak requires:
     *  1. Fetch each role representation (id + name) from the realm roles.
     *  2. POST the role representations to /users/{userId}/role-mappings/realm
     *
     * @param userId    - The Keycloak user UUID.
     * @param roleNames - Array of realm role names (e.g. ['RB_ADMINISTRATEUR']).
     */
    async function assignRealmRoles(
        userId: string,
        roleNames: string[],
    ): Promise<void> {
        if (roleNames.length === 0) {
            return;
        }
        console.log('Assign roles:', roleNames, 'To user:', userId);

        // 1. Resolve each role by name to get its representation {id, name}
        const roleRepresentations = await getRoleRepresentations(roleNames);

        // 2. Assign the roles to the user
        await post(
            `${realmUrl}/users/${userId}/role-mappings/realm`,
            roleRepresentations,
        );
    }

    /**
     * Delete realm-level roles to a user.
     *
     * Keycloak requires:
     *  1. Fetch each role representation (id + name) from the realm roles.
     *  2. POST the role representations to /users/{userId}/role-mappings/realm
     *
     * @param userId    - The Keycloak user UUID.
     * @param roleNames - Array of realm role names (e.g. ['RB_ADMINISTRATEUR']).
     */
    async function deleteRealmRoles(
        userId: string,
        roleNames: string[],
    ): Promise<void> {
        if (roleNames.length === 0) {
            return;
        }

        const roleRepresentations = await getRoleRepresentations(roleNames);

        // Endpoint DELETE avec les rôles dans le body
        await deleteRequest(
            `${realmUrl}/users/${userId}/role-mappings/realm`,
            roleRepresentations,
        );
    }

    /**
     * Assigns client-level roles to a user.
     *
     * Keycloak requires:
     *  1. Resolve the client internal UUID from its `clientId` name.
     *  2. Fetch each role representation (id + name) from the client roles.
     *  3. POST the role representations to the user's client role-mappings.
     *
     * @param userId    - The Keycloak user UUID.
     * @param roleNames - Array of client role names (e.g. ['RB_ADMINISTRATEUR']).
     * @param clientId  - Optional client clientId; defaults to KEYCLOAK_CLIENT_ID env var.
     */
    async function assignClientRoles(
        userId: string,
        roleNames: string[],
        clientId = process.env.KEYCLOAK_CLIENT_ID ?? '',
    ): Promise<void> {
        if (!clientId) {
            throw new Error('assignClientRoles: KEYCLOAK_CLIENT_ID is not set.');
        }
        if (roleNames.length === 0) {
            return;
        }

        // 1. Get the client's internal UUID
        const clientsResponse = await get<{ id: string }[]>(
            `${realmUrl}/clients?clientId=${encodeURIComponent(clientId)}`,
        );
        const clientUuid = clientsResponse.data[0]?.id;
        if (!clientUuid) {
            throw new Error(`assignClientRoles: client '${clientId}' not found in realm.`);
        }

        // 2. Resolve each role by name to get its full representation {id, name}
        const roleRepresentations = await Promise.all(
            roleNames.map(async (roleName) => {
                const roleResponse = await get<{ id: string; name: string }>(
                    `${realmUrl}/clients/${clientUuid}/roles/${encodeURIComponent(roleName)}`,
                );
                return roleResponse.data;
            }),
        );

        // 3. Assign the roles to the user
        await post(
            `${realmUrl}/users/${userId}/role-mappings/clients/${clientUuid}`,
            roleRepresentations,
        );
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

    // Récupération initiale des tokens
    // await Promise.all([
    //     resolveAdminToken(),
    //     resolvePisteToken(),
    // ]);

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
        healthcheck,
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
        assignClientRoles,
        assignRealmRoles,
        deleteRealmRoles,
    } as const;
}
