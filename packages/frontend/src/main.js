const routes = require("./js/app/routes");
// // load the whole betagouv template
import "@openfonts/fira-code_all";
import "simplebar/dist/simplebar.min.css";
import "#src/css/index.scss";
import * as Sentry from "@sentry/vue";
import { Integrations } from "@sentry/tracing";
import initStore from "#app/store";

import {
    VUE_APP_SENTRY_ON,
    VUE_APP_SENTRY,
    VUE_APP_SENTRY_RELEASE,
    VUE_APP_MATOMO_ON
} from "#src/js/env.js";

// Import vue libs
import VueI18n from "vue-i18n";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import VueMatomo from "./js/matomo/matomo";
import messages from "#app/messages";
import "./formatDate";
import registerGlobalComponents from "#app/components/ui/registerGlobalComponents";
import "./js/icons";
import guardians from "./js/app/guardians";

export default function(Vue, { appOptions, router }) {
    // Sentry should be loaded as soon as possible
    if (VUE_APP_SENTRY_ON === "true") {
        Sentry.init({
            Vue,
            // Sentry is only enabled for production env atm, we should differentiate envs if we use it for preprod/staging
            environment: "production",
            release: VUE_APP_SENTRY_RELEASE,
            dsn: VUE_APP_SENTRY,
            integrations: [new Integrations.BrowserTracing()],

            // Use this hook to scrub sensitive data sent to Sentry
            // if some sensitive data has been send, it's also possible to scrub data afterwards
            // https://docs.sentry.io/platforms/javascript/data-management/sensitive-data/#scrubbing-data
            // https://docs.sentry.io/product/data-management-settings/server-side-scrubbing/
            beforeSend(event, hint) {
                // Check what's send to sentry
                console.log("[Debug] Sentry event", { event, hint });
                return event;
            },

            // Set tracesSampleRate to 1.0 to capture 100%
            // of transactions for performance monitoring.
            // We recommend adjusting this value in production
            tracesSampleRate: 0.1,
            // Ignore common sentry errors
            // https://docs.sentry.io/platforms/javascript/configuration/filtering/#decluttering-sentry
            ignoreErrors: [
                // Random plugins/extensions
                "top.GLOBALS",
                // See: http://blog.errorception.com/2012/03/tale-of-unfindable-js-error.html
                "originalCreateNotification",
                "canvas.contentDocument",
                "MyApp_RemoveAllHighlights",
                "http://tt.epicplay.com",
                "Can't find variable: ZiteReader",
                "jigsaw is not defined",
                "ComboSearch is not defined",
                "http://loading.retry.widdit.com/",
                "atomicFindClose",
                // Facebook borked
                "fb_xd_fragment",
                // ISP "optimizing" proxy - `Cache-Control: no-transform` seems to
                // reduce this. (thanks @acdha)
                // See http://stackoverflow.com/questions/4113268
                "bmi_SafeAddOnload",
                "EBCallBackMessageReceived",
                // See http://toolbar.conduit.com/Developer/HtmlAndGadget/Methods/JSInjection.aspx
                "conduitPage"
            ],
            denyUrls: [
                // Facebook flakiness
                /graph\.facebook\.com/i,
                // Facebook blocked
                /connect\.facebook\.net\/en_US\/all\.js/i,
                // Woopra flakiness
                /eatdifferent\.com\.woopra-ns\.com/i,
                /static\.woopra\.com\/js\/woopra\.js/i,
                // Chrome extensions
                /extensions\//i,
                /^chrome:\/\//i,
                // Other plugins
                /127\.0\.0\.1:4001\/isrunning/i, // Cacaoweb
                /webappstoolbarba\.texthelp\.com\//i,
                /metrics\.itunes\.apple\.com\.edgesuite\.net\//i
            ]
        });
    }

    if (VUE_APP_MATOMO_ON === "true") {
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

    Vue.component("font-awesome-icon", FontAwesomeIcon);
    registerGlobalComponents(Vue);
    Vue.use(VueI18n);

    appOptions.i18n = new VueI18n({
        locale: "fr",
        messages
    });
    appOptions.store = initStore(Vue);

    router.beforeEach((to, from, next) => {
        // TODO: Check if we can find a way to retrieve beforeEnter with a less hacky way as they are not passed to/from
        const matchedRoute = routes.find(r => {
            if (to.matched.length === 1) {
                const matchedPath = to.matched[0].path;
                return (
                    matchedPath === r.path ||
                    (r.path === "/" && matchedPath === "")
                );
            }

            return to.path.replace(/\/$/, "") === r.path;
        });

        if (!matchedRoute) {
            return next();
        }

        const { beforeEnter } = matchedRoute.context || {};

        if (typeof beforeEnter === "function") {
            beforeEnter(to, from, next);
        } else if (guardians[beforeEnter]) {
            guardians[beforeEnter](to, from, next);
        } else {
            next();
        }
    });
}
