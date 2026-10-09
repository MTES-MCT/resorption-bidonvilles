/**
 * populate-keycloak-users.ts
 *
 * Peuple Keycloak à partir de la table `users` de la base de données, puis
 * écrit l'UUID Keycloak (= claim `sub` du JWT) dans la colonne `keycloak_id`
 * de chaque utilisateur.
 *
 * Usage :
 *   npx ts-node -r tsconfig-paths/register scripts/populate-keycloak-users.ts
 *
 * Variables d'environnement requises (via .env) :
 *   RB_API_POSTGRES_HOST / _DB / _USER / _PASSWORD / _PORT
 *   KEYCLOAK_REALM          – le realm applicatif (ex: SISIAO)
 *   KEYCLOAK_ADMIN          – login de l'admin Keycloak (ex: admin)
 *   KEYCLOAK_ADMIN_PASSWORD – mot de passe de l'admin
 *   RB_API_KEYCLOAK_URL     – URL de base de Keycloak (ex: http://localhost:8080)
 *
 * Options :
 *   --dry-run        Affiche les actions prévues sans modifier la base ni Keycloak.
 *   --skip-existing  Ignore les utilisateurs qui ont déjà un keycloak_id.
 */
/* eslint-disable no-console, no-await-in-loop, no-plusplus, no-continue, no-param-reassign, no-restricted-syntax */

import dotenv from 'dotenv';
import axios from 'axios';
import { Sequelize, QueryTypes } from 'sequelize';
import { createKeycloakApi } from '#server/utils/keycloak/keycloak.api-client';
import { CredentialRepresentation } from '#server/utils/keycloak/keycloak-api-types';

dotenv.config();

process.stdout.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EPIPE') {
        process.exit(0);
    }
});

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const DRY_RUN = process.argv.includes('--dry-run');
const SKIP_EXISTING = process.argv.includes('--skip-existing');

const KEYCLOAK_BASE_URL = process.env.RB_API_KEYCLOAK_URL ?? 'http://localhost:8080';
const KEYCLOAK_REALM = process.env.KEYCLOAK_REALM ?? '';
const KEYCLOAK_ADMIN_USER = process.env.KEYCLOAK_ADMIN ?? 'admin';
const KEYCLOAK_ADMIN_PASSWORD = process.env.KEYCLOAK_ADMIN_PASSWORD ?? '';

if (!KEYCLOAK_REALM) {
    console.error('❌  KEYCLOAK_REALM manquant dans les variables d\'environnement.');
    process.exit(1);
}
if (!KEYCLOAK_ADMIN_PASSWORD) {
    console.error('❌  KEYCLOAK_ADMIN_PASSWORD manquant dans les variables d\'environnement.');
    process.exit(1);
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface DbUser {
    user_id: number;
    email: string;
    first_name: string;
    last_name: string;
    fk_status: string;
    fk_role: 'national_admin' | 'local_admin' | null;
    fk_role_regular: 'association' | 'intervener' | 'external_observator' | 'direct_collaborator' | 'national_establisment' | 'collaborator' | null;
    password: string | null;
    salt: string | null;
    keycloak_id: string | null;
}

// ---------------------------------------------------------------------------
// DB (connexion directe, sans passer par la couche model)
// ---------------------------------------------------------------------------

const sequelize = new Sequelize(
    process.env.RB_API_POSTGRES_DB ?? 'resorption_bidonvilles',
    process.env.RB_API_POSTGRES_USER ?? 'rbadmin',
    process.env.RB_API_POSTGRES_PASSWORD ?? 'rbadmin',
    {
        host: process.env.RB_API_POSTGRES_HOST ?? 'localhost',
        port: Number(process.env.RB_API_POSTGRES_PORT ?? 5432),
        dialect: 'postgres',
        logging: false,
    },
);

// ---------------------------------------------------------------------------
// Keycloak API – deux instances Axios : une publique, une authentifiée
// ---------------------------------------------------------------------------

/** Instance publique – utilisée pour obtenir les tokens. */
const publicAxios = axios.create({ baseURL: KEYCLOAK_BASE_URL });

/**
 * Instance authentifiée – toutes les requêtes admin.
 * Le token est injecté via un intercepteur juste avant chaque requête.
 */
const adminAxios = axios.create({ baseURL: KEYCLOAK_BASE_URL });

let cachedAdminToken: string | null = null;

/** Obtient (et met en cache) un token admin Keycloak. */
async function getAdminToken(): Promise<string> {
    if (cachedAdminToken) {
        return cachedAdminToken;
    }

    const params = new URLSearchParams({
        grant_type: 'password',
        client_id: 'admin-cli',
        username: KEYCLOAK_ADMIN_USER,
        password: KEYCLOAK_ADMIN_PASSWORD,
    });

    const response = await publicAxios.post<{ access_token: string }>(
        '/realms/master/protocol/openid-connect/token',
        params,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    );

    cachedAdminToken = response.data.access_token;
    return cachedAdminToken;
}

// Intercepteur : injecte le Bearer token admin avant chaque requête authentifiée.
adminAxios.interceptors.request.use(async (config) => {
    const token = await getAdminToken();
    if (!config.headers) {
        config.headers = {} as typeof config.headers;
    }
    config.headers.Authorization = `Bearer ${token}`;
    if (!config.headers['Content-Type']) {
        config.headers['Content-Type'] = 'application/json';
    }
    return config;
});

// Recréé un token si on reçoit un 401 (token expiré pendant le script).
adminAxios.interceptors.response.use(
    response => response,
    async (error) => {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            cachedAdminToken = null;
            const token = await getAdminToken();
            const config = error.config!;
            config.headers!.Authorization = `Bearer ${token}`;
            return adminAxios.request(config);
        }
        return Promise.reject(error);
    },
);

// Instanciation du client Keycloak réutilisable
const keycloakApi = createKeycloakApi(adminAxios, publicAxios);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function log(msg: string): void {
    console.log(msg);
}

function warn(msg: string): void {
    console.warn(`⚠️   ${msg}`);
}

/** Écrit le keycloak_id dans la base de données. */
async function saveKeycloakId(userId: number, keycloakId: string): Promise<void> {
    await sequelize.query(
        'UPDATE users SET keycloak_id = :keycloakId, updated_at = NOW() WHERE user_id = :userId',
        { replacements: { keycloakId, userId }, type: QueryTypes.UPDATE },
    );
}

/**
 * Prépare les identifiants pré-hachés pour Keycloak (PBKDF2-SHA512).
 *
 * Les identifiants proviennent des hash et salt de la DB PostgreSQL.
 */
function buildCredentials(password: string | null, salt: string | null): CredentialRepresentation[] | undefined {
    if (!password || !salt) {
        return undefined;
    }

    const hash64Base64 = Buffer.from(password.slice(0, 128), 'hex').toString('base64');
    const saltBase64 = Buffer.from(salt, 'utf8').toString('base64');

    return [
        {
            type: 'password',
            secretData: JSON.stringify({
                value: hash64Base64,
                salt: saltBase64,
            }),
            credentialData: JSON.stringify({
                hashIterations: 10000,
                algorithm: 'pbkdf2-sha512',
                additionalParameters: {},
            }),
            temporary: false,
        },
    ];
}

// ---------------------------------------------------------------------------
// Logique principale
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
    if (DRY_RUN) {
        log('🔍  Mode --dry-run activé : aucune modification ne sera effectuée.\n');
    }

    // 1. Connexion à la base
    await sequelize.authenticate();
    log('✅  Connexion à la base de données OK.');

    // 2. Vérification de la connexion Keycloak et chargement des rôles du realm
    await getAdminToken();
    log(`✅  Connexion à Keycloak OK (realm: ${KEYCLOAK_REALM}).\n`);

    // 3. Lecture des utilisateurs
    const whereClause = SKIP_EXISTING
        ? "fk_status IN ('active', 'new') AND keycloak_id IS NULL"
        : "fk_status IN ('active', 'new')";

    const users = await sequelize.query<DbUser>(
        `SELECT user_id, email, first_name, last_name, fk_status, fk_role, fk_role_regular, password, salt, keycloak_id
         FROM users
         WHERE ${whereClause}
         ORDER BY user_id`,
        { type: QueryTypes.SELECT },
    );

    log(`📋  ${users.length} utilisateur(s) à traiter.`);
    if (users.length === 0) {
        log('Rien à faire.');
        await sequelize.close();
        return;
    }

    // 4. Traitement utilisateur par utilisateur
    let created = 0;
    let reused = 0;
    let skipped = 0;
    let errors = 0;

    for (const user of users) {
        const label = `[#${user.user_id}] ${user.email}`;

        try {
            // Cas 1 : l'utilisateur a déjà un keycloak_id et on ne force pas la resynchronisation
            if (user.keycloak_id && SKIP_EXISTING) {
                log(`  ⏭   ${label} — déjà synchronisé (${user.keycloak_id}), ignoré.`);
                skipped++;
                continue;
            }

            // Cas 2 : cherche si l'utilisateur existe déjà dans Keycloak par email
            const existing = await keycloakApi.getUserByEmail(user.email);

            const roleAdmin = user.fk_role;
            const isAdmin = ['national_admin', 'local_admin'].includes(roleAdmin ?? '');

            let keycloakId: string;

            if (existing?.id) {
                // Déjà présent dans Keycloak → on réutilise son UUID et on synchronise rôles / OTP
                keycloakId = existing.id;

                if (DRY_RUN) {
                    log(`  🔄  ${label} — trouvé dans Keycloak (${keycloakId}) [dry-run, OTP: ${isAdmin ? 'oui' : 'non'}].`);
                    reused++;
                } else {
                    if (isAdmin) {
                        const currentActions = existing.requiredActions ?? [];
                        if (!currentActions.includes('CONFIGURE_TOTP')) {
                            await keycloakApi.updateUser(keycloakId, {
                                ...existing,
                                requiredActions: [...currentActions, 'CONFIGURE_TOTP'],
                            });
                        }
                    }

                    log(`  🔄  ${label} — synchronisé dans Keycloak (${keycloakId})${isAdmin ? ' [OTP]' : ''}.`);
                    reused++;
                }
            } else {
                // Pas encore dans Keycloak → on le crée
                if (DRY_RUN) {
                    log(`  ➕  ${label} — serait créé (dry-run, OTP: ${isAdmin ? 'oui' : 'non'}).`);
                    created++;
                    continue;
                }

                keycloakId = await keycloakApi.createUser({
                    username: user.email,
                    email: user.email,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    enabled: ['active', 'new'].includes(user.fk_status),
                    emailVerified: true,
                    credentials: buildCredentials(user.password, user.salt),
                    requiredActions: isAdmin ? ['CONFIGURE_TOTP'] : [],
                });

                log(`  ➕  ${label} — créé dans Keycloak (${keycloakId}).`);
                created++;
            }

            // 5. Mise à jour de la base
            if (!DRY_RUN) {
                await saveKeycloakId(user.user_id, keycloakId);
                log(`       ✍️   keycloak_id = ${keycloakId} enregistré en base.`);
            } else {
                log(`       ✍️   keycloak_id = ${keycloakId} serait enregistré en base (dry-run).`);
            }
        } catch (err) {
            errors++;
            const message = err instanceof Error ? err.message : String(err);
            warn(`${label} — erreur : ${message} 👤 ${user.email} - Prénom: "${user.first_name}" Nom: "${user.last_name}"`);
        }
    }

    // 6. Récapitulatif
    log('\n─────────────────────────────────────────');
    log(`Résultat (${DRY_RUN ? 'dry-run' : 'réel'}) :`);
    log(`  ➕  Créés      : ${created}`);
    log(`  🔄  Réutilisés : ${reused}`);
    log(`  ⏩  Ignorés    : ${skipped}`);
    log(`  ❌  Erreurs    : ${errors}`);
    log('─────────────────────────────────────────');

    await sequelize.close();

    if (errors > 0) {
        process.exit(1);
    }
}

main().catch((err) => {
    console.error('❌  Erreur fatale :', err);
    process.exit(1);
});
