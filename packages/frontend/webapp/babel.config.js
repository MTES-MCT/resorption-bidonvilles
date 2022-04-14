module.exports = api => {
    // workaround for https://github.com/cypress-io/cypress/issues/2945
    if (api.cache.using(() => process.env.CYPRESS_INTERNAL_ENV)) {
        return {};
    }

    return {
        presets: ["@vue/app"]
    };
};
