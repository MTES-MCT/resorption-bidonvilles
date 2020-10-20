const path = require('path');

module.exports = {
    chainWebpack: (config) => {
        config.resolve.alias
            .set('#app', path.resolve(__dirname, './src/js/app/'))
            .set('#root', path.resolve(__dirname, './src/js/'))
            .set('#src', path.resolve(__dirname, './src/'))
            .set('#helpers', path.resolve(__dirname, './src/js/helpers'));
    },
};
