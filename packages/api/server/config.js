const path = require('path');

const config = {
    assetsSrc: path.resolve(__dirname, '../assets'),
    frontUrl: process.env.RB_API_FRONT_URL,
    backUrl: process.env.RB_API_BACK_URL,
    port: 80,
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
        mongo_address: `mongodb://${process.env.RB_API_MONGO_USERNAME}:${process.env.RB_API_MONGO_PASSWORD}@rb_database_agenda`,
    },
    mattermost: {},
    sentry: {
        dsn: process.env.RB_API_SENTRY_DSN || '',
    },
    testEmail: process.env.RB_API_TEST_EMAIL || null,
    mailBlacklist: process.env.RB_API_EMAIL_BLACKLIST
        ? process.env.RB_API_EMAIL_BLACKLIST.split(',').map(id => parseInt(id, 10))
        : [],
    sendActivitySummary: process.env.RB_API_SEND_ACTIVITY_SUMMARY === '1',
    matomo: {
        token: process.env.RB_API_MATOMO_AUTH_TOKEN,
    },
};

config.mattermost = process.env.RB_API_MATTERMOST_WEBHOOK;

module.exports = config;
