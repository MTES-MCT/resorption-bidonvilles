const path = require("path");
const SentryPlugin = require("@sentry/webpack-plugin");
const { DefinePlugin } = require("webpack");
const { version } = require("./package.json");

const { VUE_APP_SENTRY_RELEASE } = require("./src/js/env.js");

module.exports = {
    pages: {
        index: "./src/js/index.js"
    },

    configureWebpack: {
        devServer: {
            progress: false,
            disableHostCheck: true
        },
        plugins: [
            ...(process.env.VUE_APP_SENTRY_SOURCEMAP_AUTHKEY
                ? [
                      new SentryPlugin({
                          authToken:
                              process.env.VUE_APP_SENTRY_SOURCEMAP_AUTHKEY,
                          release: VUE_APP_SENTRY_RELEASE,
                          org: "resorption-bidonvilles",
                          project: "resorption-bidonvilles",

                          // webpack specific configuration
                          include: "./dist"
                      })
                  ]
                : []),
            new DefinePlugin({
                "process.env.APP_VERSION": JSON.stringify(version)
            })
        ]
    },

    chainWebpack: config => {
        config.resolve.alias
            .set("#app", path.resolve(__dirname, "./src/js/app/"))
            .set("#src", path.resolve(__dirname, "./src/"))
            .set("#helpers", path.resolve(__dirname, "./src/js/helpers"));
        config.plugins.delete("progress");
    },

    lintOnSave: false
};
