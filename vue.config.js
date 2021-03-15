const path = require("path");
const SentryPlugin = require("@sentry/webpack-plugin");

const version = require("./src/js/version.json");
process.env.VUE_APP_VERSION = version;
process.env.VUE_APP_SENTRY_RELEASE = `rb-front@${version}`;

module.exports = {
    pages: {
        index: "./src/js/index.js"
    },

    configureWebpack: {
        plugins: [
            new SentryPlugin({
                authToken:
                    "13dc3d0b5cd94173b25d34ba54e7975365bbc073218a4b1aa17fe5a35fa26bb2",
                release: process.env.VUE_APP_SENTRY_RELEASE,
                org: "resorption-bidonvilles",
                project: "resorption-bidonvilles",

                // webpack specific configuration
                include: "./dist"
            })
        ]
    },

    chainWebpack: config => {
        config.resolve.alias
            .set("#app", path.resolve(__dirname, "./src/js/app/"))
            .set("#root", path.resolve(__dirname, "./src/js/"))
            .set("#src", path.resolve(__dirname, "./src/"))
            .set("#helpers", path.resolve(__dirname, "./src/js/helpers"));
    },

    lintOnSave: false
};
