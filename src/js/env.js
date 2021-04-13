const version = require("./version.json");

module.exports = {
    VUE_APP_API_URL: process.env.VUE_APP_API_URL || "${VUE_APP_API_URL}",
    VUE_APP_MATOMO_ON: process.env.VUE_APP_MATOMO_ON || "${VUE_APP_MATOMO_ON}",
    VUE_APP_SENTRY_ON: process.env.VUE_APP_SENTRY_ON || "${VUE_APP_SENTRY_ON}",
    VUE_APP_SENTRY: process.env.VUE_APP_SENTRY || "${VUE_APP_SENTRY}",
    VUE_APP_VERSION: version,
    VUE_APP_SENTRY_RELEASE: `rb-front@${version}`
};
