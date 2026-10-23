import axios, {
    AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig,
} from 'axios';
import type { AxiosInstance } from 'axios';
import {
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
 * @param rawAuthenticatedInstance - Instance Axios pour les appels admin.
 * @param rawPublicInstance        - Instance Axios pour les appels publics (tokens, certs).
 * @param tokenProviders           - Optionnel. Fournisseurs de tokens admin Keycloak et Piste.
 *                                   Quand fournis, les tokens sont injectés automatiquement
 *                                   dans chaque requête via des intercepteurs et rafraîchis
 *                                   en cas de réponse 401.
 */
export async function createKeycloakApi(
    rawAuthenticatedInstance?: AxiosInstance,
    rawPublicInstance?: AxiosInstance,
    tokenProviders?: TokenProviders,
) {
    const realm: string = process.env.KEYCLOAK_REALM;
    const realmUrl: string = `/admin/realms/${realm}`;

    const publicInstance: AxiosInstance = rawPublicInstance ?? axios.create({ baseURL: KEYCLOAK_BASE_URL });
    const authenticatedInstance: AxiosInstance = rawAuthenticatedInstance ?? axios.create({ baseURL: PISTE_URL });

    // -------------------------------------------------------------------------
    // Gestion interne des tokens (cache vivant dans la closure de l'instance)
    // -------------------------------------------------------------------------

    // Cache admin Keycloak — persistant entre tous les appels de cette instance.
    let cachedAdminToken: string | null = null;
    // Cache token PISTE — persistant entre tous les appels de cette instance.
    let cachedPisteToken: string | null = null;

    // Récupère un nouveau token admin Keycloak et le stocke dans le cache.
    // Ne doit être appelé que lorsque le cache est null (premier appel ou après un 401).
    async function fetchAdminToken(): Promise<string> {
        const adminClientId: string = process.env.RB_API_KEYCLOAK_BACK_CLIENT_ADMIN ?? 'rb-admin';
        const adminClientSecret: string | undefined = process.env.RB_API_KEYCLOAK_BACK_CLIENT_ADMIN_SECRET;
        const params: URLSearchParams = new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: adminClientId,
            ...(adminClientSecret ? { client_secret: adminClientSecret } : {}),
            scope: 'openid',
        });

        try {
            const response: AxiosResponse<TokenResponse> = await publicInstance.post<TokenResponse>(
                `/auth/realms/${realm}/protocol/openid-connect/token`,
                params,
                { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
            );

            // On ne stocke dans le cache QU'APRÈS un fetch réussi.
            cachedAdminToken = response.data.access_token;
            return cachedAdminToken;
        } catch (err) {
            throw err;
        }
    }

    /**
     * Résout le token admin à utiliser.
     * Si un provider est fourni, utilise celui-ci, sinon utilise le cache.
     * @returns Le token admin à utiliser
     */
    async function resolveAdminToken(): Promise<string> {
        if (tokenProviders) {
            return tokenProviders.getAdminToken();
        }
        // Retourne le token en cache s'il est encore valide, sinon en récupère un nouveau.
        return cachedAdminToken ?? fetchAdminToken();
    }

    /**
     * Récupère un nouveau token PISTE servant à auth le client "admin" de keycloak et le stocke dans le cache.
     * Ne doit être appelé que lorsque le cache est null (premier appel ou après un 401).
     * @throws Error si les variables d'environnement RB_API_PISTE_CLIENT_ID ou RB_API_PISTE_CLIENT_SECRET sont manquantes
     * @returns Le token PISTE
     */
    async function fetchPisteToken(): Promise<string> {
        const pisteClientId: string = process.env.RB_API_PISTE_CLIENT_ID;
        const pisteClientSecret: string = process.env.RB_API_PISTE_CLIENT_SECRET;
        const pisteOauthUrl: string = process.env.RB_API_PISTE_OAUTH_URL ?? 'https://sandbox-oauth.piste.gouv.fr';

        if (!pisteClientId || !pisteClientSecret) {
            throw new Error('Variables RB_API_PISTE_CLIENT_ID ou RB_API_PISTE_CLIENT_SECRET manquantes');
        }
        const params: URLSearchParams = new URLSearchParams({
            grant_type: 'client_credentials',
            scope: 'openid',
            client_id: pisteClientId,
            client_secret: pisteClientSecret,
        });
        const response: AxiosResponse<TokenResponse> = await publicInstance.post<TokenResponse>(
            `${pisteOauthUrl}/api/oauth/token`,
            params,
        );
        // On ne stocke dans le cache QU'APRÈS un fetch réussi.
        cachedPisteToken = response.data.access_token;
        return cachedPisteToken;
    }

    /**
     * Résout le token PISTE à utiliser.
     * Si un provider est fourni, utilise celui-ci, sinon utilise le cache.
     * @returns Le token PISTE à utiliser
     */
    async function resolvePisteToken(): Promise<string> {
        if (tokenProviders) {
            return tokenProviders.getPisteToken();
        }
        return cachedPisteToken ?? fetchPisteToken();
    }


    /**
     * Intercepteurs Axios : injectent les tokens sur chaque requête authentifiée
     * et invalident le cache + réessaient une fois en cas de 401.
     * @param {InternalAxiosRequestConfig} config - Configuration de la requête
     * @returns {Promise<InternalAxiosRequestConfig>} Configuration de la requête avec tokens injectés
     */
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

    /**
     * Intercepteur Axios pour la gestion des erreurs 401.
     * En cas d'erreur 401, invalide les caches internes et réessaie une fois la requête.
     * @param {unknown} error - Erreur Axios
     * @returns {Promise<unknown>} Erreur Axios ou réponse
     */
    authenticatedInstance.interceptors.response.use(
        response => response,
        async (error: unknown) => {
            if (error instanceof AxiosError && error.response?.status === 401) {
                const originalRequest: AxiosRequestConfig & { retried?: boolean } = error.config as (typeof error.config & { retried?: boolean });
                if (originalRequest && !originalRequest.retried) {
                    originalRequest.retried = true;

                    // Invalider les caches internes et forcer un nouveau fetch.
                    if (!tokenProviders) {
                        cachedAdminToken = null;
                        cachedPisteToken = null;
                    }

                    const [adminToken, pisteToken]: [string, string] = await Promise.all([
                        resolveAdminToken(),
                        resolvePisteToken(),
                    ]);

                    originalRequest.headers = originalRequest.headers ?? {} as typeof originalRequest.headers;
                    originalRequest.headers.Authorization = `Bearer ${pisteToken}`;
                    originalRequest.headers['X-Admin-Token'] = adminToken;

                    return authenticatedInstance.request(originalRequest);
                }
            }
            return Promise.reject(error);
        },
    );

    /**
     * Helper - Construit un message d'erreur.
     * @param {string} httpMethod - Méthode HTTP
     * @param {string} url - URL
     * @param {AxiosError<{ errorMessage: string }>} axiosError - Erreur Axios
     * @returns {string} Message d'erreur
     */
    function buildMessage(httpMethod: string, url: string, axiosError: AxiosError<{ errorMessage: string }>): string {
        return `Echec ${httpMethod} ${url} avec le statut ${axiosError.response?.statusText ?? '(pas de code)'} et le détail ${axiosError.response ? JSON.stringify(axiosError.response.data) : 'Pas de message'}`;
    }

    /**
     * POST - Envoie une requête POST à l'API
     * @param {string} url - URL de l'API
     * @param {unknown} body - Corps de la requête
     * @param {AxiosRequestConfig} config - Configuration de la requête
     * @returns {Promise<AxiosResponse<T>>} Réponse de l'API
     */
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

    /**
     * DELETE - Envoie une requête DELETE à l'API
     * @param {string} url - URL de l'API
     * @param {unknown} body - Corps de la requête
     * @param {AxiosRequestConfig} config - Configuration de la requête
     * @returns {Promise<AxiosResponse<T>>} Réponse de l'API
     */
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

    /**
     * PUT - Envoie une requête PUT à l'API
     * @param {string} url - URL de l'API
     * @param {unknown} body - Corps de la requête
     * @param {AxiosRequestConfig} config - Configuration de la requête
     * @returns {Promise<AxiosResponse<T>>} Réponse de l'API
     */
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

    /**
     * GET - Envoie une requête GET à l'API
     * @param {string} url - URL de l'API
     * @param {AxiosRequestConfig} config - Configuration de la requête
     * @returns {Promise<AxiosResponse<T>>} Réponse de l'API
     */
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

    /**
     * Healthcheck - Vérifie si l'API est en cours de fonctionnement, permet de déclencher un renew de token
     * @returns {Promise<AxiosResponse>} Réponse de l'API
     */
    async function healthcheck(): Promise<AxiosResponse> {
        let healthResponse: AxiosResponse;
        try {
            healthResponse = await authenticatedInstance.get('/healthcheck');
            return healthResponse.data;
        } catch (e) {
            throw e;
        }
    }

    /**
     * GET - Envoie une requête GET à l'API
     * @param {string} url - URL de l'API
     * @param {AxiosRequestConfig} config - Configuration de la requête
     * @returns {Promise<AxiosResponse<T> | undefined>} Réponse de l'API
     */
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

    /**
     * Récupère tous les utilisateurs en paginant
     * @param {string} url - URL de l'API
     * @returns {Promise<UserRepresentation[]>} Liste des utilisateurs
     */
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
        return allUsers;
    }

    /**
     * Récupère la clé publique admin
     * @returns {Promise<PublicKeys>} Clé publique admin
     */
    async function getAdminPublicKey(): Promise<PublicKeys> {
        const response = await publicInstance.get<PublicKeys>(`/auth/realms/${realm}/protocol/openid-connect/certs`);
        return response.data;
    }

    /**
     * Récupère le token admin (client admin servant aux actions sur Keycloak)
     * @param {AdminCredentials} adminCredentials - Identifiants admin
     * @returns {Promise<string>} Token admin
     */
    async function getAdminToken(adminCredentials: AdminCredentials): Promise<string> {
        const body: URLSearchParams = new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: 'rb-admin',
            ...adminCredentials,
        });
        const response: AxiosResponse<TokenResponse> = await publicInstance.post<TokenResponse>(
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

    /**
     * Récupère tous les utilisateurs
     * @returns {Promise<UserRepresentation[]>} Liste des utilisateurs
     */
    async function getUsers(): Promise<UserRepresentation[]> {
        return fetchAllUserPages(`${realmUrl}/users`);
    }

    /**
     * Crée un utilisateur et retourne son ID (que l'on stock sous 'keycloak_id' en DB).
     * @param {UserRepresentation} user - Utilisateur à créer
     * @returns {Promise<string>} ID de l'utilisateur créé
     */
    async function createUser(user: UserRepresentation): Promise<string> {
        const response: AxiosResponse<{ location: string }> = await post(`${realmUrl}/users`, user);
        const userLocation = response.headers.location;
        return userLocation.split('/').pop()!;
    }

    /**
     * Met à jour un utilisateur.
     * @param {string} userId - ID de l'utilisateur à mettre à jour
     * @param {UserRepresentation} user - Utilisateur à mettre à jour
     * @returns {Promise<void>}
     */
    async function updateUser(userId: string, user: UserRepresentation): Promise<void> {
        await put(`${realmUrl}/users/${userId}`, user);
    }

    /**
     * Récupère un utilisateur par son email (car il peut y en avoir plusieurs).
     * @param {string} email - Email de l'utilisateur
     * @returns {Promise<UserRepresentation | undefined>} Utilisateur trouvé
     */
    async function getUserByEmail(email: string): Promise<UserRepresentation | undefined> {
        const response: AxiosResponse<UserRepresentation[]> = await get<UserRepresentation[]>(`${realmUrl}/users?email=${email}&exact=true`);
        return response.data[0];
    }

    /**
     * Récupère un utilisateur par son ID.
     * @param {string} id - ID de l'utilisateur
     * @returns {Promise<UserRepresentation | undefined>} Utilisateur trouvé
     */
    async function getUserById(id: string): Promise<UserRepresentation | undefined> {
        const response:AxiosResponse<UserRepresentation> | undefined = await getOrUndefinedIf404<UserRepresentation>(`${realmUrl}/users/${id}`);
        return response?.data;
    }

    /**
     * Récupère les représentations des rôles, utilisées pour les octroyer ou enlever aux utilisateurs.
     * @param {string[]} roleNames - Noms des rôles
     * @returns {Promise<{ id: string; name: string }[]>} Représentations des rôles
     */
    async function getRoleRepresentations(roleNames: string[]): Promise<{ id: string; name: string }[]> {
        return Promise.all(
            roleNames.map(async (roleName) => {
                const roleResponse:AxiosResponse<{ id: string; name: string }> = await get<{ id: string; name: string }>(
                    `${realmUrl}/roles/${encodeURIComponent(roleName)}`,
                );
                return roleResponse.data;
            }),
        );
    }

    /**
     * Assigne des rôles à un utilisateur.
     *
     * Keycloak demande:
     *  1. Récupération des représentations des rôles depuis les rôles du realm.
     *  2. POST des représentations des rôles vers /users/{userId}/role-mappings/realm
     *
     * @param userId    - L'UUID de l'utilisateur Keycloak.
     * @param roleNames - Les rôles du realm à assigner.
     * @returns {Promise<void>}
     */
    async function assignRealmRoles(
        userId: string,
        roleNames: string[],
    ): Promise<void> {
        if (roleNames.length === 0) {
            return;
        }
        const roleRepresentations: { id: string; name: string }[] = await getRoleRepresentations(roleNames);

        await post(
            `${realmUrl}/users/${userId}/role-mappings/realm`,
            roleRepresentations,
        );
    }

    /**
     * Révoque des rôles à un utilisateur.
     *
     * Keycloak demande:
     *  1. Récupération des représentations des rôles depuis les rôles du realm.
     *  2. POST des représentations des rôles vers /users/{userId}/role-mappings/realm
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

        const roleRepresentations: { id: string; name: string }[] = await getRoleRepresentations(roleNames);

        await deleteRequest(
            `${realmUrl}/users/${userId}/role-mappings/realm`,
            roleRepresentations,
        );
    }

    return {
        getAdminPublicKey,
        getAdminToken,
        healthcheck,
        getUsers,
        createUser,
        updateUser,
        getUserByEmail,
        getUserById,
        assignRealmRoles,
        deleteRealmRoles,
    } as const;
}
