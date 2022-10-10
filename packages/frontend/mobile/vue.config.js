const path = require("path");
const { DefinePlugin } = require("webpack");
const { version } = require("./package.json");
const { icons } = require("./public/img/icons/icons.json");

const { VUE_APP_MOBILE_HOST } = require("./src/env.js");

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
            .set("#src", path.resolve(__dirname, "./src/"))
            .set("#helpers", path.resolve(__dirname, "./src/js/helpers"))
            .set("#frontend", path.resolve(__dirname, ".."));
    },

    pwa: {
        name: "Résorption-bidonvilles",
        themeColor: "#00006D",
        msTileColor: "#ffffff",
        manifestOptions: {
            icons: icons.map(icon => {
                icon.src = `./img/icons/${icon.src}`;
                return icon;
            })
        },
        appleMobileWebAppCapable: "yes"
    }
};
