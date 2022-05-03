import VueMatomo from 'vue-matomo';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(VueMatomo, {
        host: "https://stats.data.gouv.fr",
        siteId: 86,
        domains: "*.resorption-bidonvilles.beta.gouv.fr",
        cookieDomain: "*.resorption-bidonvilles.beta.gouv.fr",
        router: nuxtApp.$router,
        trackerScriptUrl: '/matomo.js'
    });
});
