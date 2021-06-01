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
    slack: {},
    sentry: {
        dsn: process.env.RB_API_SENTRY_DSN || '',
    },
    testEmail: process.env.RB_API_TEST_EMAIL || null,
};

let webhookIndex = 1;
while (process.env[`RB_API_SLACK_WEBHOOK_${webhookIndex}`]) {
    const [name, url] = process.env[`RB_API_SLACK_WEBHOOK_${webhookIndex}`].split(';');
    config.slack[name] = url;
    webhookIndex += 1;
}

module.exports = config;
