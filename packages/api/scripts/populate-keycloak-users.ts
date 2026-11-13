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
const PISTE_URL = process.env.RB_API_PISTE_URL ?? 'https://sandbox-api.piste.gouv.fr';
const KEYCLOAK_REALM = process.env.KEYCLOAK_REALM ?? '';

if (!KEYCLOAK_REALM) {
    console.error('❌  KEYCLOAK_REALM manquant dans les variables d\'environnement.');
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
 * Les tokens (admin Keycloak + PISTE) sont gérés automatiquement par createKeycloakApi
 * via les variables d'environnement.
 */
const adminAxios = axios.create({ baseURL: PISTE_URL });

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
    log('# Enregistrement de l\'ID Keycloak en DB métier');

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
    log(' # Création du hash/salt du mot de passe pour Keycloak');

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

function getRealmRole(user: DbUser): 'RB_ADMINISTRATEUR' | 'RB_UTILISATEUR' {
    const isAdmin = ['national_admin', 'local_admin'].includes(user.fk_role ?? '');

    return isAdmin ? 'RB_ADMINISTRATEUR' : 'RB_UTILISATEUR';
}

async function syncUserInKeycloak(
    user: DbUser,
    keycloakApi: Awaited<ReturnType<typeof createKeycloakApi>>,
): Promise<{ keycloakId: string; action: 'created' | 'reused' | 'skipped' }> {
    if (user.keycloak_id && SKIP_EXISTING) {
        return { keycloakId: user.keycloak_id, action: 'skipped' };
    }

    const existing = await keycloakApi.getUserByEmail(user.email);
    const realmRole = getRealmRole(user);

    if (existing?.id) {
        const keycloakId = existing.id;

        if (!DRY_RUN) {
            await keycloakApi.assignRealmRoles(keycloakId, [realmRole]);
        }

        return { keycloakId, action: 'reused' };
    }

    if (DRY_RUN) {
        return { keycloakId: 'dry-run', action: 'created' };
    }

    const keycloakId = await keycloakApi.createUser({
        username: user.email,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        enabled: ['active', 'new'].includes(user.fk_status),
        emailVerified: true,
        credentials: buildCredentials(user.password, user.salt),
    });

    await keycloakApi.assignRealmRoles(keycloakId, [realmRole]);

    return { keycloakId, action: 'created' };
}

async function getUsersToSync(): Promise<DbUser[]> {
    const whereClause = SKIP_EXISTING
        ? "fk_status IN ('active', 'new') AND keycloak_id IS NULL"
        : "fk_status IN ('active', 'new')";

    return sequelize.query<DbUser>(
        `SELECT user_id, email, first_name, last_name, fk_status, fk_role, fk_role_regular, password, salt, keycloak_id
         FROM users
         WHERE ${whereClause}
         AND user_id in ('513', '1168', '2546', '3354', '205')
         ORDER BY user_id`,
        { type: QueryTypes.SELECT },
    );
}

async function processUsers(
    users: DbUser[],
    keycloakApi: Awaited<ReturnType<typeof createKeycloakApi>>,
): Promise<{ created: number; reused: number; skipped: number; errors: number }> {
    let created = 0;
    let reused = 0;
    let skipped = 0;
    let errors = 0;

    for (const user of users) {
        const label = `[#${user.user_id}] ${user.email}`;

        try {
            const result = await syncUserInKeycloak(user, keycloakApi);
            const isDryRun = DRY_RUN ? ' serait' : '';

            switch (result.action) {
                case 'skipped':
                    log(`  ⏭   ${label} — déjà synchronisé (${result.keycloakId}), ignoré.`);
                    skipped++;
                    continue;
                case 'created':
                    log(`  ➕  ${label} —${isDryRun} créé dans Keycloak (${result.keycloakId}).`);
                    created++;
                    break;
                default:
                    log(`  🔄  ${label} — synchronisé dans Keycloak (${result.keycloakId}).`);
                    reused++;
                    break;
            }

            const saveMessage = !DRY_RUN
                ? `keycloak_id = ${result.keycloakId} enregistré en base.`
                : `keycloak_id = ${result.keycloakId} serait enregistré en base (dry-run).`;

            if (!DRY_RUN) {
                await saveKeycloakId(user.user_id, result.keycloakId);
            }

            log(`       ✍️   ${saveMessage}`);
        } catch (err) {
            errors++;
            const message = err instanceof Error ? err.message : String(err);
            warn(`${label} — erreur : ${message} 👤 ${user.email} - Prénom: "${user.first_name}" Nom: "${user.last_name}"`);
        }
    }

    return {
        created, reused, skipped, errors,
    };
}

async function main(): Promise<void> {
    log('# Démarrage du script de peuplement de Keycloak');

    if (DRY_RUN) {
        log('🔍  Mode --dry-run activé : aucune modification ne sera effectuée.\n');
    }

    await sequelize.authenticate();
    log('✅  Connexion à la base de données OK.');

    const keycloakApi = createKeycloakApi(adminAxios, publicAxios);
    log(`✅  Connexion à Keycloak OK (server: ${KEYCLOAK_BASE_URL} realm: ${KEYCLOAK_REALM}).\n`);

    const users = await getUsersToSync();

    log(`📋  ${users.length} utilisateur(s) à traiter.`);
    if (users.length === 0) {
        log('Rien à faire.');
        await sequelize.close();
        return;
    }

    const stats = await processUsers(users, keycloakApi);

    log('\n─────────────────────────────────────────');
    log(`Résultat (${DRY_RUN ? 'dry-run' : 'réel'}) :`);
    log(`  ➕  Créés      : ${stats.created}`);
    log(`  🔄  Réutilisés : ${stats.reused}`);
    log(`  ⏩  Ignorés    : ${stats.skipped}`);
    log(`  ❌  Erreurs    : ${stats.errors}`);
    log('─────────────────────────────────────────');

    await sequelize.close();

    if (stats.errors > 0) {
        process.exit(1);
    }
}

main().catch((err) => {
    console.error('❌  Erreur fatale :', err);
    process.exit(1);
});
