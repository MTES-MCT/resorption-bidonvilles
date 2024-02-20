import VueMatomo, { TrackerCustomizer } from 'vue-matomo';

// Fonction pour remplacer le séparateur original "/" par "::"
const replaceSeparator = (url: string) => {
    return url.replace(/\//g, '::');
};

const shouldUseCustomizer = (separator: string): boolean => {
    return (
        separator !== "undefined" &&
        separator !== "/"
    );
};
export default defineNuxtPlugin((nuxtApp) => {
    const {
        MATOMO_ENABLE,
        MATOMO_HOST,
        MATOMO_SITE_ID,
        MATOMO_DOMAIN,
        MATOMO_TRACKER_FILENAME,
        MATOMO_DESCRIPTION_PAGE_SEPARATOR,
    } = useRuntimeConfig().public;

    if (MATOMO_ENABLE !== "true") {
        return;
    }

    nuxtApp.vueApp.use(VueMatomo, {
        host: MATOMO_HOST,
        siteId: MATOMO_SITE_ID,
        domains: `*.${MATOMO_DOMAIN}`,
        cookieDomain: `*.${MATOMO_DOMAIN}`,
        trackPageViewCustomizer: shouldUseCustomizer(MATOMO_DESCRIPTION_PAGE_SEPARATOR as string)
            ? (data: TrackerCustomizer) => {
                data.url = replaceSeparator(data.url);
                return data;
            }
            : undefined,
        trackerFileName: MATOMO_TRACKER_FILENAME,
        trackerScriptUrl: `/${MATOMO_TRACKER_FILENAME}.js`,
    });

    window._paq.push(['trackPageView']);
});
