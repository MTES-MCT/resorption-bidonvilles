import { fileURLToPath } from "url";

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
    modules: [
        "@nuxtjs/tailwindcss",
        ["@nuxtjs/i18n", {
            locales: ["fr", "en", "bg", "ro"],
            defaultLocale: "fr",
            parallelPlugin: false,
        }],
    ],
    css: [
        "@common/fontawesome/css/fontawesome.css",
        "@common/fontawesome/css/brands.css",
        "@common/fontawesome/css/solid.css",
    ],
    vite: {
        server: {
            hmr: {
                port: 8091,
                protocol: "ws",
                host: "localhost"
            },
            allowedHosts: ["host.docker.internal", "localhost"],
        },
        optimizeDeps: {
            include: [
                '@vue/devtools-core',
                '@vue/devtools-kit',
                'vue-matomo', // CJS
                'vee-validate',
                'date-fns/locale',
            ]
        },
        css: {
            lightningcss: {
                errorRecovery: true,
            },
        },
        envPrefix: ['VITE_'],
    },
    runtimeConfig: {
        debugLogs: process.env.NUXT_DEBUG_LOGS ?? "false",
        debugRequestLogs: process.env.NUXT_DEBUG_REQUESTS ?? "false",
        public: {
            DOMAIN: process.env.NUXT_PUBLIC_DOMAIN ?? "${NUXT_PUBLIC_DOMAIN}",
            WEBAPP_URL: process.env.NUXT_PUBLIC_WEBAPP_URL ?? "${NUXT_PUBLIC_WEBAPP_URL}",
            BLOG_URL: process.env.NUXT_PUBLIC_BLOG_URL ?? "${NUXT_PUBLIC_BLOG_URL}",
            FORMATION_URL: process.env.NUXT_PUBLIC_FORMATION_URL ?? "${NUXT_PUBLIC_FORMATION_URL}",
            CONTACT_EMAIL: process.env.NUXT_PUBLIC_CONTACT_EMAIL ?? "${NUXT_PUBLIC_CONTACT_EMAIL}",
            MATOMO_ENABLE: process.env.NUXT_PUBLIC_MATOMO_ENABLE ?? "${NUXT_PUBLIC_MATOMO_ENABLE}",
            MATOMO_HOST: process.env.NUXT_PUBLIC_MATOMO_HOST ?? "${NUXT_PUBLIC_MATOMO_HOST}",
            MATOMO_SITE_ID: process.env.NUXT_PUBLIC_MATOMO_SITE_ID ?? "${NUXT_PUBLIC_MATOMO_SITE_ID}",
            MATOMO_DOMAIN: process.env.NUXT_PUBLIC_MATOMO_DOMAIN ?? "${NUXT_PUBLIC_MATOMO_DOMAIN}",
            MATOMO_TRACKER_FILENAME: process.env.NUXT_PUBLIC_MATOMO_TRACKER_FILENAME ?? "${NUXT_PUBLIC_MATOMO_TRACKER_FILENAME}",
            MATOMO_DESCRIPTION_PAGE_SEPARATOR: process.env.NUXT_PUBLIC_MATOMO_DESCRIPTION_PAGE_SEPARATOR ?? "${NUXT_PUBLIC_MATOMO_DESCRIPTION_PAGE_SEPARATOR}",
        },
    },
    sourcemap: {
        server: true,
        client: false,
    },
    app: {
        head: {
            htmlAttrs: {
                lang: "fr"
            }
        }
    },
    alias: {
        "@common": fileURLToPath(new URL("../common/", import.meta.url)),
        "@stores": fileURLToPath(new URL("../webapp/src/stores", import.meta.url)),
    },
    compatibilityDate: "2024-08-30",
});
