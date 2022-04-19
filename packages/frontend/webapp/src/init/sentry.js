import * as Sentry from "@sentry/vue";
import { Integrations } from "@sentry/tracing";
import {
    VUE_APP_SENTRY_ON,
    VUE_APP_SENTRY,
    VUE_APP_SENTRY_RELEASE
} from "#src/js/env.js";

export default function(Vue) {
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
}
