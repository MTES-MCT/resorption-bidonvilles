const path = require("path");

module.exports = {
    plugins: [
        {
            use: "gridsome-plugin-tailwindcss"
        },
    ],
    chainWebpack: config => {
        config.resolve.alias
            .set("#app", path.resolve(__dirname, "./src/js/app/"))
            .set("#src", path.resolve(__dirname, "./src/"))
            .set("#helpers", path.resolve(__dirname, "./src/js/helpers"))
            .set("#matomo", path.resolve(__dirname, "./src/js/matomo"));
        config.plugins.delete("progress");
    }
};
