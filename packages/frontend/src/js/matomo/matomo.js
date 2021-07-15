/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import { get as getConfig } from "#helpers/api/config";

const defaultOptions = {
    debug: false,
    enableLinkTracking: true,
    requireConsent: false,
    trackInitialView: true,
    trackerFileName: "piwik"
};

function loadScript(trackerScript) {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.async = true;
        script.defer = true;
        script.src = trackerScript;

        const head = document.head || document.getElementsByTagName("head")[0];
        head.appendChild(script);

        script.onload = resolve;
        script.onerror = reject;
    });
}

export function setCustomVariables($piwik, user) {
    if (!$piwik) {
        return;
    }

    $piwik.setUserId(user.id);

    const location =
        user.organization.location[user.organization.location.type];

    // Convert user's data to a easily parsable string:
    // ie: superuser:false,is_admin:false,role:association,org_category:association,org_location_type:departement,org_location_name:Gironde,org_location_code:33
    const userData = JSON.stringify({
        superuser: user.is_superuser,
        is_admin: user.is_admin,
        role: user.role_id,
        org_category: user.organization.category.uid,
        org_location_type: user.organization.location.type,
        org_location_name: location?.name,
        org_location_code: location?.code
    })
        .replaceAll('"', "")
        .replaceAll("{", "")
        .replaceAll("}", "");

    $piwik.setCustomVariable(1, "user", userData);

    const departement = user.organization.location.departement || null;
    $piwik.setCustomVariable(
        5,
        "departement_code",
        departement ? departement.code : null
    );
}

function trackEvent($piwik, eventCategory, eventName, eventArgs) {
    if (!$piwik) {
        return;
    }

    const { user } = getConfig() || {};

    if (user) {
        setCustomVariables($piwik, user);
    }

    $piwik.trackEvent(eventCategory, eventName, eventArgs);
}

function initMatomo(Vue, options) {
    const { host, siteId, trackerFileName, trackerUrl } = options;
    const trackerEndpoint = trackerUrl || `${host}/${trackerFileName}.php`;

    const Matomo = window.Piwik.getTracker(trackerEndpoint, siteId);

    // Assign matomo to Vue
    Vue.prototype.$piwik = Matomo;
    Vue.prototype.$matomo = Matomo;
    Vue.prototype.$trackMatomoEvent = trackEvent.bind(window, Matomo);

    if (options.requireConsent) {
        Matomo.requireConsent();
    }

    if (options.trackInitialView) {
        // Register first page view
        Matomo.trackPageView();
    }

    if (options.enableLinkTracking) {
        Matomo.enableLinkTracking();
    }

    // Track page navigations if router is specified
    if (options.router) {
        options.router.afterEach(to => {
            // Unfortunately the window location is not yet updated here
            // We need to make our own url using the data provided by the router
            const loc = window.location;

            // Protocol may or may not contain a colon
            let { protocol } = loc;
            if (protocol.slice(-1) !== ":") {
                protocol += ":";
            }

            const maybeHash = options.router.mode === "hash" ? "/#" : "";
            const url = `${protocol}//${loc.host}${maybeHash}${to.fullPath}`;

            if (to.meta.analyticsIgnore) {
                return;
            }

            if (options.debug) {
                console.debug(`[vue-matomo] Tracking ${url}`);
            }

            Matomo.setCustomUrl(url);
            Matomo.trackPageView();
        });
    }
}

export default function install(Vue, setupOptions = {}) {
    const options = { ...defaultOptions, ...setupOptions };

    const { host, trackerFileName } = options;
    const trackerScript = `${host}/${trackerFileName}.js`;

    loadScript(trackerScript)
        .then(() => initMatomo(Vue, options))
        .catch(error => {
            const msg = `[vue-matomo] An error occurred trying to load ${error.target.src}. `;
            ("If the file exists you may have an ad- or trackingblocker enabled.");

            console.error(msg);

            Vue.prototype.$trackMatomoEvent = () => {};
        });
}
