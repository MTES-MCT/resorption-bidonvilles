import VueMatomo, { TrackerCustomizer } from 'vue-matomo';
const {
    MATOMO_HOST,
    MATOMO_SITE_ID,
    MATOMO_DOMAIN,
    MATOMO_TRACKER_FILENAME,
    MATOMO_DESCRIPTION_PAGE_SEPARATOR,
} = useRuntimeConfig().public;

// Fonction pour remplacer le séparateur original "/" par "::"
const replaceSeparator = (url: string) => {
    return url.replace(/\//g, '::');
};

const shouldUseCustomizer = (): boolean => {
    return (
        MATOMO_DESCRIPTION_PAGE_SEPARATOR !== "undefined" &&
        MATOMO_DESCRIPTION_PAGE_SEPARATOR !== "/"
    );
};

export default defineNuxtPlugin((nuxtApp) => {
    const { DOMAIN } = useRuntimeConfig().public;
    nuxtApp.vueApp.use(VueMatomo, {
        host: MATOMO_HOST,
        siteId: MATOMO_SITE_ID,
        domains: `*.${MATOMO_DOMAIN}`,
        cookieDomain: `*.${MATOMO_DOMAIN}`,
        router: nuxtApp.$router,
        trackerScriptUrl: `'/'${MATOMO_TRACKER_FILENAME}`,
        // Modifier l'URL avant de la suivre
        trackPageViewCustomizer: shouldUseCustomizer()
            ? (data: TrackerCustomizer) => {
                data.url = replaceSeparator(data.url);
                return data;
            }
            : undefined,
    });
});
