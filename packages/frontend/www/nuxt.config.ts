import { fileURLToPath } from "url";

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
    modules: [
        "@nuxtjs/tailwindcss",
        ["@nuxtjs/i18n", {
            locales: ["fr", "en", "bg", "ro"],
            defaultLocale: "fr",
            parallelPlugin: false,
        }]
    ],
    css: [
        "@common/fontawesome/css/fontawesome.css",
        "@common/fontawesome/css/brands.css",
        "@common/fontawesome/css/solid.css"
    ],
    vite: {
        server: {
            port: 8091,
            hmr: {
                protocol: "ws",
                host: "localhost"
            }
        }
    },
    build: {
        transpile: [
            'chart.js'
        ]
    },
    runtimeConfig: {
        public: {
            API_URL: process.env.NUXT_API_URL || "${NUXT_API_URL}",
            WEBAPP_URL: process.env.NUXT_WEBAPP_URL || "${NUXT_WEBAPP_URL}",
            WWW_URL: process.env.NUXT_WWW_URL || "${NUXT_WWW_URL}",
            CONTACT_EMAIL: process.env.NUXT_CONTACT_EMAIL || "${NUXT_CONTACT_EMAIL}",
        }
    },
    alias: {
        "@common": fileURLToPath(new URL("../common/", import.meta.url))
    }
});
