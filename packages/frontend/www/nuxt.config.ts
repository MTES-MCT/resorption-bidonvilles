import { defineNuxtConfig } from 'nuxt3';
import messages from "./assets/i18n/index.js";

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
    modules: [
        "@nuxtjs/tailwindcss",
        ["@nuxtjs/i18n-edge", {
            locales: ["fr", "en", "bg", "ro"],
            defaultLocale: "fr",
            vueI18n: {
                fallbackLocale: "fr",
                messages
            }
        }]
    ],
    css: [
        "@fortawesome/fontawesome-svg-core/styles.css"
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
            '@fortawesome/fontawesome-svg-core',
            '@fortawesome/free-solid-svg-icons',
            '@fortawesome/free-brands-svg-icons',
            '@fortawesome/vue-fontawesome',
            'chart.js'
        ]
    },
    publicRuntimeConfig: {
        API_URL: process.env.NUXT_API_URL || "${NUXT_API_URL}",
        WEBAPP_URL: process.env.NUXT_WEBAPP_URL || "${NUXT_WEBAPP_URL}",
    }
});
