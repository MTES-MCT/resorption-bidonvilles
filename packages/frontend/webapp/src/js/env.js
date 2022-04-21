const VERSION = process.env.APP_VERSION;
const VUE_APP_WEBAPP_HOST =
    process.env.VUE_APP_WEBAPP_HOST || "${VUE_APP_WEBAPP_HOST}";

module.exports = {
    VUE_APP_WWW_URL: process.env.VUE_APP_WWW_URL || "${VUE_APP_WWW_URL}",
    VUE_APP_WEBAPP_HOST,
    VUE_APP_API_URL: process.env.VUE_APP_API_URL || "${VUE_APP_API_URL}",
    VUE_APP_MATOMO_ON: process.env.VUE_APP_MATOMO_ON || "${VUE_APP_MATOMO_ON}",
    VUE_APP_SENTRY_ON: process.env.VUE_APP_SENTRY_ON || "${VUE_APP_SENTRY_ON}",
    VUE_APP_SENTRY: process.env.VUE_APP_SENTRY || "${VUE_APP_SENTRY}",
    APP_VERSION: VERSION,
    VUE_APP_SENTRY_RELEASE: `rb-front@${VERSION}`
};
