const path = require("path");
const { DefinePlugin } = require("webpack");
const { version } = require("./package.json");

const {
    VUE_APP_MOBILE_HOST
} = require("./src/env.js");

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
            port: "8093",
            public: VUE_APP_MOBILE_HOST,
            disableHostCheck: true
        },
        plugins: [
            new DefinePlugin({
                "process.env.APP_VERSION": JSON.stringify(version)
            })
        ]
    },

    chainWebpack: config => {
        config.resolve.alias
            .set("#src", path.resolve(__dirname, "./src/"));
    },

    pwa: {
        name: "Résorption-bidonvilles",
        themeColor: "#00006D",
        msTileColor: "#000000",
        appleMobileWebAppCapable: "yes",

        // configure the workbox plugin
        workboxPluginMode: 'InjectManifest',
        workboxOptions: {
            // swSrc is required in InjectManifest mode.
            swSrc: 'dev/sw.js',
            // ...other Workbox options...
        }
    }
};
