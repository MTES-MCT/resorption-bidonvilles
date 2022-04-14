import VueMatomo from 'vue-matomo';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(VueMatomo, {
        host: "https://stats.data.gouv.fr",
        siteId: 86,
        router: nuxtApp.$router,
        trackerScriptUrl: '/matomo.js'
    });
});
