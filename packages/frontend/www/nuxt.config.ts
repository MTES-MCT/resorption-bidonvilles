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
            hmr: {
                port: 8091,
                protocol: "ws",
                host: "localhost"
            }
        }
    },
    runtimeConfig: {
        public: {
            DOMAIN: process.env.NUXT_DOMAIN ?? "${NUXT_DOMAIN}",
            WEBAPP_URL: process.env.NUXT_WEBAPP_URL ?? "${NUXT_WEBAPP_URL}",
            CONTACT_EMAIL: process.env.NUXT_CONTACT_EMAIL ?? "${NUXT_CONTACT_EMAIL}",
            MATOMO_ENABLE: process.env.NUXT_MATOMO_ENABLE ?? "${NUXT_MATOMO_ENABLE}",
            MATOMO_HOST: process.env.NUXT_MATOMO_HOST ?? "${NUXT_MATOMO_HOST}",
            MATOMO_SITE_ID: process.env.NUXT_MATOMO_SITE_ID ?? "${NUXT_MATOMO_SITE_ID}",
            MATOMO_DOMAIN: process.env.NUXT_MATOMO_DOMAIN ?? "${NUXT_MATOMO_DOMAIN}",
            MATOMO_TRACKER_FILENAME: process.env.NUXT_MATOMO_TRACKER_FILENAME ?? "${NUXT_MATOMO_TRACKER_FILENAME}",
            MATOMO_DESCRIPTION_PAGE_SEPARATOR: process.env.NUXT_MATOMO_DESCRIPTION_PAGE_SEPARATOR ?? "${NUXT_MATOMO_DESCRIPTION_PAGE_SEPARATOR}",
        }
    },
    alias: {
        "@common": fileURLToPath(new URL("../common/", import.meta.url)),
        "@stores": fileURLToPath(new URL("../webapp/src/stores", import.meta.url))
    },
    compatibilityDate: "2024-08-30"
});
