const path = require("path");
const SentryPlugin = require("@sentry/webpack-plugin");
const { DefinePlugin } = require("webpack");
const { version } = require("./package.json");

const { VUE_APP_SENTRY_RELEASE } = require("./src/js/env.js");

module.exports = {
    title: "Résorption Bidonvilles",
    siteDescription:
        "Résorption-bidonvilles, outil d’information, de partage et de pilotage, la plateforme offre une solution performante et efficace pour la résorption des bidonvilles.",
    siteUrl: "https://resorption-bidonvilles.beta.gouv.fr/",
    titleTemplate: "%s Résorption Bidonvilles ",
    icon: {
        favicon: './static/img/logo-marianne.svg',
    },
    plugins: [
        {
            use: "gridsome-plugin-tailwindcss"
        },
        {
            use: "gridsome-plugin-pug"
        }
        // {
        //     use: "gridsome-plugin-bundle-analyzer"
        // }
    ],
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
                "process.env.APP_VERSION": JSON.stringify(version),
                // TODO: Check why we have to add these
                "process.env.VUE_APP_API_URL": JSON.stringify(
                    process.env.VUE_APP_API_URL
                ),
                "process.env.VUE_APP_MATOMO_ON": JSON.stringify(
                    process.env.VUE_APP_MATOMO_ON
                ),
                "process.env.VUE_APP_SENTRY_ON": JSON.stringify(
                    process.env.VUE_APP_SENTRY_ON
                ),
                "process.env.VUE_APP_SENTRY": JSON.stringify(
                    process.env.VUE_APP_SENTRY
                )
            })
        ]
    },
    chainWebpack: (config, { isProd, isClient }) => {
        if (isProd && isClient) {
            config.optimization.splitChunks({
                chunks: "all",
                maxInitialRequests: Infinity,
                cacheGroups: {
                    geojson: {
                        test: /[\\/]geojson[\\/]/,
                        name: "geojson",
                        reuseExistingChunk: true,
                        priority: 100
                    }
                }
            });
        }

        config.resolve.alias
            .set("#app", path.resolve(__dirname, "./src/js/app/"))
            .set("#src", path.resolve(__dirname, "./src/"))
            .set("#helpers", path.resolve(__dirname, "./src/js/helpers"))
            .set("#matomo", path.resolve(__dirname, "./src/js/matomo"));
        config.plugins.delete("progress");
    },
    prefetch: {
        mask: "^$" // example - disable all prefetch
    }
};
