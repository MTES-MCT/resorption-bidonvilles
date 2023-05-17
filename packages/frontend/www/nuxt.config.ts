// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
    alias: {
        "@common": "/../common",
    },
    modules: [
        "@nuxtjs/tailwindcss",
        ["@nuxtjs/i18n", {
            locales: ["fr", "en", "bg", "ro"],
            defaultLocale: "fr",
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
    runtimeConfig: {
        public: {
            API_URL: process.env.NUXT_API_URL || "${NUXT_API_URL}",
            WEBAPP_URL: process.env.NUXT_WEBAPP_URL || "${NUXT_WEBAPP_URL}",
            DOMAIN: process.env.NUXT_DOMAIN || "${NUXT_DOMAIN}",
        }
    }
});
