import { VUE_APP_MATOMO_ON } from "#src/js/env.js";
import VueMatomo from "#matomo/matomo";

export default function(Vue) {
    if (VUE_APP_MATOMO_ON === "true") {
        if (typeof String.prototype.replaceAll === "undefined") {
            String.prototype.replaceAll = function(match, replace) {
                return this.replace(new RegExp(match, "g"), () => replace);
            };
        }

        Vue.use(VueMatomo, {
            // Configure your matomo server and site by providing
            host: "https://stats.data.gouv.fr",
            siteId: 86,

            // Changes the default .js and .php endpoint's filename
            // Default: 'piwik'
            trackerFileName: "piwik",

            // Enables automatically registering pageviews on the router
            // router,

            // Enables link tracking on regular links. Note that this won't
            // work for routing links (ie. internal Vue router links)
            // Default: true
            enableLinkTracking: true,

            // Require consent before sending tracking information to matomo
            // Default: false
            requireConsent: false,

            // Whether to track the initial page view
            // Default: true
            trackInitialView: true,

            // Whether or not to log debug information
            // Default: false
            debug: true
        });
    } else {
        Vue.prototype.$trackMatomoEvent = () => {};
    }
}
