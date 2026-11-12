import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config();

export default {
    // valeur de NODE_ENV conservée telle quelle si elle est non vide ; absente ou vide => "development".
    // Seule la valeur exacte "production" active les vrais salons Tchap (la bascule est faite dans utils/tchap.ts)
    environnement: process.env.NODE_ENV || 'development',
    // Étiquette d'environnement (ex. "PREPROD", "DEVELOPPEMENT"), vide en production ; absente, vide ou espaces => ''.
    // C'est la seconde barrière du routage Tchap (voir utils/tchap.ts), commune en esprit à VITE_ENV_LABEL du webapp :
    // seule une étiquette vide permet d'ouvrir les vrais salons.
    envLabel: (process.env.RB_API_ENV_LABEL ?? '').trim(),
    assetsSrc: path.resolve(__dirname, '../assets'),
    wwwUrl: `https://${process.env.RB_API_FRONT_DOMAIN}`,
    webappUrl: `https://app.${process.env.RB_API_FRONT_DOMAIN}`,
    backUrl: process.env.RB_API_BACK_URL,
    port: process.env.RB_API_PORT,
    blogUrl: process.env.RB_API_BLOG_URL,
    auth: {
        secret: process.env.RB_API_AUTH_SECRET,
        expiresIn: process.env.RB_API_AUTH_EXPIRES_IN,
    },
    activationTokenExpiresIn: process.env.RB_API_ACTIVATION_TOKEN_EXPIRES_IN,
    passwordResetDuration: process.env.RB_API_PASSWORD_RESET_EXPIRES_IN,
    mail: {
        publicKey: process.env.RB_API_MAILJET_PUBLIC_KEY,
        privateKey: process.env.RB_API_MAILJET_PRIVATE_KEY,
    },
    agenda: {
        mongo_address: `mongodb://${process.env.RB_API_MONGO_USERNAME}:${process.env.RB_API_MONGO_PASSWORD}@${process.env.RB_API_MONGO_HOST}`,
    },
    tchap: {
        token: process.env.RB_API_TCHAP_TOKEN,
        baseUrl: process.env.RB_API_TCHAP_BASE_URL,
        // Room ID Matrix de chaque salon de notification, lu dans l'environnement, jamais en dur dans le dépôt.
        channels: {
            'notif-dev-test': process.env.RB_API_TCHAP_NOTIF_DEV_TEST,
            'notif-invitations-intervenants': process.env.RB_API_TCHAP_NOTIF_INVITATIONS_INTERVENANTS,
            'notif-nettoyage-pieces-jointes': process.env.RB_API_TCHAP_NOTIF_NETTOYAGE_PIECES_JOINTES,
            'notif-intervenants-declares': process.env.RB_API_TCHAP_NOTIF_INTERVENANTS_DECLARES,
            'notif-canicule': process.env.RB_API_TCHAP_NOTIF_CANICULE,
            'notif-requetes-cadastre': process.env.RB_API_TCHAP_NOTIF_REQUETES_CADASTRE,
            'notif-action-nouveau-commentaire': process.env.RB_API_TCHAP_NOTIF_ACTION_NOUVEAU_COMMENTAIRE,
            'notif-site-nouveau-commentaire': process.env.RB_API_TCHAP_NOTIF_SITE_NOUVEAU_COMMENTAIRE,
            'notif-nouveaux-utilisateurs': process.env.RB_API_TCHAP_NOTIF_NOUVEAUX_UTILISATEURS,
            tech: process.env.RB_API_TCHAP_TECH,
            'notif-auto-desactivations': process.env.RB_API_TCHAP_NOTIF_AUTO_DESACTIVATIONS,
            'notif-anonymisation': process.env.RB_API_TCHAP_NOTIF_ANONYMISATION,
            'notif-personnes-invitees': process.env.RB_API_TCHAP_NOTIF_PERSONNES_INVITEES,
            'notif-absence-pilote-action': process.env.RB_API_TCHAP_NOTIF_ABSENCE_PILOTE_ACTION,
            'notif-fermeture-sites': process.env.RB_API_TCHAP_NOTIF_FERMETURE_SITES,
            'notif-reinstallation': process.env.RB_API_TCHAP_NOTIF_REINSTALLATION,
            'notif-ouverture-sites': process.env.RB_API_TCHAP_NOTIF_OUVERTURE_SITES,
        },
    },
    sentry: {
        dsn: process.env.RB_API_SENTRY_DSN || '',
    },
    testEmail: process.env.RB_API_TEST_EMAIL || null,
    sendActivitySummary: process.env.RB_API_SEND_ACTIVITY_SUMMARY === '1',
    sendActionAlerts: process.env.RB_API_SEND_ACTION_ALERTS === '1',
    checkInactiveUsers: process.env.RB_API_CHECK_INACTIVE_USERS === '1',
    cleanAttachmentsArchives: process.env.RB_API_CLEAN_ATTACHMENTS_ARCHIVES === '1',
    anonymizeOwners: process.env.RB_API_ANONYMIZE_OWNERS === '1',
    anonymizeInactiveUsers: process.env.RB_API_ANONYMIZE_INACTIVE_USERS === '1',
    deactivateExpiredUsersInDB: process.env.RB_API_DEACTIVATE_EXPIRED_USERS === '1',
    purgeOldSigninLogs: process.env.RB_API_PURGE_OLD_SIGNIN_LOGS === '1',
    inactivityAlert: {
        delayBeforeAlert: '6 month',
        delayBeforeDeactivation: '1 month',
    },
    S3: process.env.RB_API_S3_ACCESS_KEY ? {
        endpoint: process.env.RB_API_S3_ENDPOINT ?? undefined,
        publicEndpoint: process.env.RB_API_S3_PUBLIC_ENDPOINT ?? undefined,
        accessKeyId: process.env.RB_API_S3_ACCESS_KEY,
        secretAccessKey: process.env.RB_API_S3_SECRET_KEY,
        region: process.env.RB_API_S3_REGION,
        bucket: process.env.RB_API_S3_BUCKET,
        expirationTime: process.env.RB_API_S3_EXPIRATION_TIME ?? 3600, // 1 heure par défaut
    } : null,
    clamav: {
        port: process.env.RB_API_CLAMAV_PORT,
        host: process.env.RB_API_CLAMAV_URL,
    },
};
