import VueMatomo from "vue-matomo";
import { computed } from "vue";
import ENV from "@/helpers/env.js";

const { MATOMO } = ENV;
const $piwik = computed(() => {
    return typeof window !== "undefined" ? window.Piwik?.getTracker() : null;
});

export function useMatomo(app, router) {
    if (!MATOMO) {
        return;
    }

    // Si on utilise le serveur matomo DNUM, il faut modifier l'URL
    // avant l'envoi à Matomo pour rester compatible avec Xiti
    // Le séparateur original "/" est remplacé par "::"
    if (
        typeof MATOMO.DESCRIPTION_PAGE_SEPARATOR !== "undefined" &&
        MATOMO.DESCRIPTION_PAGE_SEPARATOR !== "/"
    ) {
        router.beforeTrack = (to) => {
            const modifiedPath = to.fullPath.replace(
                /\//g,
                MATOMO.DESCRIPTION_PAGE_SEPARATOR
            );
            return { ...to, fullPath: modifiedPath };
        };
    }

    app.use(VueMatomo, {
        host: MATOMO.HOST,
        siteId: MATOMO.SITE_ID,
        router,
        trackInitialView: false,
        cookieDomain: `*.${MATOMO.DOMAIN}`,
        domains: `*.${MATOMO.DOMAIN}`,
        trackerFileName: MATOMO.TRACKER_FILENAME,

        trackerScriptUrl: `/${MATOMO.TRACKER_FILENAME}.js`,
    });

    window._paq.push(["trackPageView"]);
}

export function trackLogin(user) {
    if (!$piwik.value) {
        return;
    }

    $piwik.value.setUserId(user.id);
    $piwik.value.setCustomVariable(1, "user", formatUserForTracking(user));
    $piwik.value.setCustomVariable(
        5,
        "departement_code",
        user.intervention_areas.areas
            .filter(
                ({ is_main_area, departement }) =>
                    departement?.code !== undefined && is_main_area === true
            )
            .map(({ departement }) => `;${departement.code};`)
            .join("")
    );
}

export function trackLogout() {
    if (!$piwik.value) {
        return;
    }

    $piwik.value.resetUserId();
    $piwik.value.setCustomVariable(1, "user", null);
    $piwik.value.setCustomVariable(5, "departement_code", null);
}

export function trackEvent(...args) {
    if (!$piwik.value) {
        return;
    }

    return $piwik.value.trackEvent(...args);
}

export function optOut() {
    if ($piwik.value) {
        return $piwik.value.optUserOut();
    }
    return null;
}

export function forgetOptOut() {
    if ($piwik.value) {
        return $piwik.value.forgetUserOptOut();
    }
    return null;
}

export function isOptedOut() {
    if ($piwik.value) {
        return $piwik.value.isUserOptedOut();
    }
    return true;
}

function formatUserForTracking(user) {
    const { organization } = user;
    const area = user.intervention_areas.areas.find(
        (area) => area.is_main_area === true
    );
    const { type: orgType } = organization;
    const location = area[area.type];

    return JSON.stringify({
        superuser: user.is_superuser,
        is_admin: user.is_admin,
        role: user.role_id,
        org_id: organization.id,
        org_name: organization.abbreviation || user.organization.name,
        org_type: orgType.abbreviation || orgType.name_singular,
        org_category: organization.category.uid,
        org_location_type: area.type,
        org_location_name: location?.name,
        org_location_code: location?.code,
    }).replace(/["{}]/g, "");
}
