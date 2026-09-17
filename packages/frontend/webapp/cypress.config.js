const { defineConfig } = require("cypress");

module.exports = defineConfig({
    e2e: {
        specPattern: "cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}",
        baseUrl: "https://app.resorption-bidonvilles.localhost",
        hosts: {
            "resorption-bidonvilles.localhost": "127.0.0.1",
        },
    },
});
