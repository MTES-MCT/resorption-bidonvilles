const VERSION = process.env.APP_VERSION;

module.exports = {
    VUE_APP_MOBILE_HOST:
        process.env.VUE_APP_MOBILE_HOST || "${VUE_APP_MOBILE_HOST}",
    VUE_APP_MOBILE_API_HOST:
        process.env.VUE_APP_MOBILE_API_HOST || "${VUE_APP_MOBILE_API_HOST}",
    APP_VERSION: VERSION
};
