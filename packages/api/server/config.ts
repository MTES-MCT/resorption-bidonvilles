import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export default {
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
    mattermost: process.env.RB_API_MATTERMOST_WEBHOOK || false,
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
    inactivityAlert: {
        delayBeforeAlert: '6 month',
        delayBeforeDeactivation: '1 month',
    },
    S3: process.env.RB_API_S3_ACCESS_KEY ? {
        endpoint: process.env.RB_API_S3_ENDPOINT || undefined,
        publicEndpoint: process.env.RB_API_S3_PUBLIC_ENDPOINT || undefined,
        accessKeyId: process.env.RB_API_S3_ACCESS_KEY,
        secretAccessKey: process.env.RB_API_S3_SECRET_KEY,
        region: process.env.RB_API_S3_REGION,
        bucket: process.env.RB_API_S3_BUCKET,
        expirationTime: process.env.RB_API_S3_EXPIRATION_TIME || 3600, // 1 heure par défaut
    } : null,
    clamav: {
        port: process.env.RB_API_CLAMAV_PORT,
        host: process.env.RB_API_CLAMAV_URL,
    },
};
