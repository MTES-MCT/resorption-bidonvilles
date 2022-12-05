/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
    root: true,
    extends: [
        "plugin:vue/vue3-essential",
        "eslint:recommended",
        "@vue/eslint-config-prettier",
    ],
    overrides: [
        {
            files: ["cypress/e2e/**.{cy,spec}.{js,ts,jsx,tsx}"],
            extends: ["plugin:cypress/recommended"],
        },
    ],
    rules: {
        "vue/multi-word-component-names": ["error", {
            "ignores": ["Annuaire", "Carte", "Cartographie", "Layout", "Loading", "Notification", "Statistiques"]
        }]
    },

    globals: {
        __APP_VERSION__: "readonly",
    },
};
