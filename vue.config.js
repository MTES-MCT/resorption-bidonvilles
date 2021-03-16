const path = require("path");

module.exports = {
    pages: {
        index: "./src/js/index.js"
    },

    configureWebpack: {
        devServer: {
            progress: false,
            disableHostCheck: true
        }
    },

    chainWebpack: config => {
        config.resolve.alias
            .set("#app", path.resolve(__dirname, "./src/js/app/"))
            .set("#root", path.resolve(__dirname, "./src/js/"))
            .set("#src", path.resolve(__dirname, "./src/"))
            .set("#helpers", path.resolve(__dirname, "./src/js/helpers"));
        config.plugins.delete('progress');
    },

    lintOnSave: false
};
