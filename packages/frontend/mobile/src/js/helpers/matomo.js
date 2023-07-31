import VueMatomo from "vue-matomo";
import ENV from "#src/env.js";
import { computed } from "vue";

const { MATOMO } = ENV;
const $piwik = computed(() => {
    return typeof window !== "undefined" ? window.Piwik?.getTracker() : null;
});

export function useMatomo(app, router) {
    if (!MATOMO) {
        return;
    }

    app.use(VueMatomo, {
        host: MATOMO.HOST,
        siteId: MATOMO.SITE_ID,
        router,
        trackInitialView: false,
        cookieDomain: `*.${MATOMO.DOMAIN}`,
        domains: `*.${MATOMO.DOMAIN}`,
    });
}

export function trackEvent(...args) {
    if (!$piwik.value) {
        return;
    }

    return $piwik.value.trackEvent(...args);
}
