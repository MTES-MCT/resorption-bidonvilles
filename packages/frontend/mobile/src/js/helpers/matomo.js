import VueMatomo from "vue-matomo";
import { computed } from "vue";
import ENV from "#src/env.js";

const { MATOMO } = ENV;
const $piwik = computed(() => {
    return typeof window !== "undefined" ? window.Piwik?.getTracker() : null;
});

export function useMatomo(app, router) {
    if (!$piwik.value) {
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
