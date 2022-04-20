const path = require("path");
const SentryPlugin = require("@sentry/webpack-plugin");
const { DefinePlugin } = require("webpack");
const { version } = require("./package.json");

const {
    VUE_APP_WEBAPP_HOST,
    VUE_APP_SENTRY_RELEASE
} = require("./src/js/env.js");

module.exports = {
    css: {
        loaderOptions: {
            postcss: {
                theme: {},
                variants: {},
                plugins: [require("tailwindcss"), require("autoprefixer")()]
            }
        }
    },

    configureWebpack: {
        devServer: {
            host: "0.0.0.0",
            port: "8092",
            public: VUE_APP_WEBAPP_HOST,
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
            .set("#helpers", path.resolve(__dirname, "./src/js/helpers"))
            .set("#matomo", path.resolve(__dirname, "./src/js/matomo"));
        config.plugins.delete("progress");
    },

    lintOnSave: false
};
