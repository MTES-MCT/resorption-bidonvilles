import VueMatomo from "vue-matomo";
import ENV from "#src/env.js";

const { MATOMO } = ENV;

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
