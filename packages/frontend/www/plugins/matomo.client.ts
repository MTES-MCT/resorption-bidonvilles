import VueMatomo from 'vue-matomo';

export default defineNuxtPlugin((nuxtApp) => {
    const { DOMAIN } = useRuntimeConfig().public;
    nuxtApp.vueApp.use(VueMatomo, {
        host: "https://stats.data.gouv.fr",
        siteId: 86,
        domains: `*.${DOMAIN}`,
        cookieDomain: `*.${DOMAIN}`,
        router: nuxtApp.$router,
        trackerScriptUrl: '/matomo.js'
    });
});
