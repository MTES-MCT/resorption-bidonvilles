// load the whole betagouv template
import "@openfonts/fira-code_all";
import "simplebar/dist/simplebar.min.css";
import "#src/css/index.scss";
import Vue from "vue";
import * as Sentry from "@sentry/vue";
import { Integrations } from "@sentry/tracing";

// Sentry should be loaded as soon as possible
if (process.env.VUE_APP_SENTRY) {
    Sentry.init({
        Vue,
        // TODO : Sentry is only enabled for production env, we might use it for different envs
        environment: "production",
        release: `rb-front@${process.env.VUE_APP_VERSION}`,
        dsn: process.env.VUE_APP_SENTRY,
        integrations: [new Integrations.BrowserTracing()],

        // Set tracesSampleRate to 1.0 to capture 100%
        // of transactions for performance monitoring.
        // We recommend adjusting this value in production
        tracesSampleRate: 1.0,
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

// import polyfills
import "core-js/stable";
import "regenerator-runtime/runtime";

// Import vue libs
import VueI18n from "vue-i18n";
import VueRouter from "vue-router";
import TrendChart from "vue-trend-chart";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import App from "./App.vue";

// import font-awesome
import "./icons";
import messages from "./app/messages";
import registerGlobalComponents from "./app/components/ui/registerGlobalComponents";
import VueMatomo from "./matomo/matomo";
import { router } from "#app/router";
import store from "#app/store";

const MONTHS = [
    { long: "Janvier", short: "jan." },
    { long: "Février", short: "fév." },
    { long: "Mars", short: "mars" },
    { long: "Avril", short: "avr." },
    { long: "Mai", short: "mai" },
    { long: "Juin", short: "juin" },
    { long: "Juillet", short: "juil." },
    { long: "Août", short: "août" },
    { long: "Septembre", short: "sep." },
    { long: "Octobre", short: "oct." },
    { long: "Novembre", short: "nov." },
    { long: "Décembre", short: "déc." }
];

window.App = Object.freeze({
    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    },

    dateDiff(t1, t2) {
        const d1 = new Date(t1);
        const d2 = new Date(t2);

        let months;
        months = (d2.getFullYear() - d1.getFullYear()) * 12;
        months -= d1.getMonth() + 1;
        months += d2.getMonth();
        months = months <= 0 ? 0 : months;

        if (months === 0) {
            const days =
                Math.abs(d1.getTime() - d2.getTime()) / (1000 * 3600 * 24);
            return `${days} jour${days > 1 ? "s" : ""}`;
        }

        if (months < 12) {
            return `${months} mois`;
        }
        if (months === 12) {
            return "1 an";
        }

        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;

        let str = `${years} an${years > 1 ? "s" : ""}`;
        if (remainingMonths > 0) {
            str += ` ${remainingMonths} mois`;
        }

        return str;
    },

    formatDate(timestamp, format = "d/m/y") {
        const date = new Date(timestamp * 1000);
        return format
            .replace("d", `0${date.getDate()}`.slice(-2))
            .replace("m", `0${date.getMonth() + 1}`.slice(-2))
            .replace("y", date.getFullYear())
            .replace("h", `0${date.getHours()}`.slice(-2))
            .replace("i", `0${date.getMinutes()}`.slice(-2))
            .replace("M", MONTHS[date.getMonth()].long)
            .replace("B", MONTHS[date.getMonth()].short);
    }
});

Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.use(TrendChart);
Vue.use(VueRouter);
Vue.use(VueI18n);

if (process.env.VUE_APP_MATOMO_ON === "true") {
    Vue.use(VueMatomo, {
        // Configure your matomo server and site by providing
        host: "https://stats.data.gouv.fr",
        siteId: 86,

        // Changes the default .js and .php endpoint's filename
        // Default: 'piwik'
        trackerFileName: "piwik",

        // Enables automatically registering pageviews on the router
        router,

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
}

// Register styleguide components
registerGlobalComponents(Vue);

const i18n = new VueI18n({
    locale: "fr",
    messages
});

Vue.createElement = obj => new Vue(obj);
Vue.createElement({
    el: "#app",
    router,
    store,
    i18n,
    render: h => h(App)
});
