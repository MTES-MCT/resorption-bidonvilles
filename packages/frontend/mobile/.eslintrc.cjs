/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
    root: true,
    extends: [
        "plugin:vue/vue3-essential",
        "eslint:recommended",
        "@vue/eslint-config-prettier",
    ],
    rules: {
        "vue/no-reserved-component-names": "off",
        "vue/multi-word-component-names": [
            "error",
            {
                ignores: [
                    "Tag",
                    "Signin",
                    "Logout",
                    "Launcher",
                    "Notification",
                    "Navbar",
                    "Layout",
                    "Container",
                ],
            },
        ],
    },
    parserOptions: {
        ecmaVersion: "latest",
    },
    overrides: [
        {
            files: ["**/registerServiceWorker.js"],
            globals: {
                process: "readonly",
            },
        },
        {
            files: ["src/**/*.js"],
            globals: {
                __APP_VERSION__: "readonly",
            },
        },
        {
            files: ["vite.config.js"],
            globals: {
                require: "readonly",
            },
        },
    ],
};
