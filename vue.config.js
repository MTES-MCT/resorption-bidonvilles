const path = require("path");

process.env.VUE_APP_VERSION = require("./src/js/version.json");

module.exports = {
    pages: {
        index: "./src/js/index.js"
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
