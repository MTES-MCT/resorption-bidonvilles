import VueMatomo from "vue-matomo";
import { computed } from "vue";
import ENV from "#src/env.js";

const { MATOMO } = ENV;
const $piwik = computed(() => {
    return typeof window !== "undefined" ? window.Piwik?.getTracker() : null;
});

if ($piwik.value) {
    console.log("matomo est bien initialisé");
    console.log(`$piwik: ${$piwik.value}`);
} else {
    console.log("matomo n'est pas initialisé");
}

export function useMatomo(app, router) {
    console.log(`$piwik.value: ${$piwik.value}`);

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
