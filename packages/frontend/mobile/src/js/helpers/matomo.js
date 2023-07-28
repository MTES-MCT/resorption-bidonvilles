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
        // Si on utilise le serveur matomo DNUM, il faut modifier l'URL
        // avant l'envoi à Matomo pour rester compatible avec Xiti
        // Le séparateur original "/" est remplacé par "::"
        router:
            typeof MATOMO.DESCRIPTION_PAGE_SEPARATOR !== "undefined" &&
            MATOMO.DESCRIPTION_PAGE_SEPARATOR !== "/"
                ? // MATOMO.DESCRIPTION_PAGE_SEPARATOR est initialisée avec une valeur
                  {
                      beforeTrack(to) {
                          const modifiedPath = to.fullPath.replace(
                              /\//g,
                              MATOMO.DESCRIPTION_PAGE_SEPARATOR
                          );
                          return { ...to, fullPath: modifiedPath };
                      },
                  }
                : router,
        trackInitialView: false,
        cookieDomain: `*.${MATOMO.DOMAIN}`,
        domains: `*.${MATOMO.DOMAIN}`,
        trackerFileName: MATOMO.TRACKER_FILENAME,
    });
}
