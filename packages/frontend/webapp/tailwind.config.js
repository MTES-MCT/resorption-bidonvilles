const path = require("path");
const commonConfig = require("@resorptionbidonvilles/ui/tailwind.config.js");
const uiPath = path.dirname(require.resolve("@resorptionbidonvilles/ui"));

/** @type {import('tailwindcss').Config} */
module.exports = {
    ...commonConfig,
    content: ["./index.html", "./src/**/*.{vue,js}", `${uiPath}/**/*.{vue,js}`],
};
