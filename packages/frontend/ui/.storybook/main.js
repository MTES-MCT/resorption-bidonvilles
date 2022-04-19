module.exports = {
    "stories": [
        "../src/**/*.stories.js",
    ],
    "addons": [
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        {
            name: '@storybook/addon-postcss',
            options: {
                cssLoaderOptions: {
                    importLoaders: 1,
                },
                postcssLoaderOptions: {
                    // When using postCSS 8
                    implementation: require('postcss'),
                }
            },
        }
    ],
    "framework": "@storybook/vue3"
}