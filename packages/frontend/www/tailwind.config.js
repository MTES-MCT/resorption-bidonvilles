const path = require("path");
const commonConfig = require("@resorptionbidonvilles/ui/tailwind.config.js");
const uiPath = path.dirname(require.resolve("@resorptionbidonvilles/ui"));

module.exports = {
    ...commonConfig,
    content: [
        "./components/**/*.{vue,js}",
        "./layouts/**/*.{vue,js}",
        "./pages/**/*.{vue,js}",
        `${uiPath}/**/*.{vue,js}`
    ]
};
