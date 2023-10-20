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

    app.use(VueMatomo, {
        host: MATOMO.HOST,
        siteId: MATOMO.SITE_ID,
        router,
        trackInitialView: false,
        cookieDomain: `*.${MATOMO.DOMAIN}`,
        domains: `*.${MATOMO.DOMAIN}`,
    });
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
        user.organization.location?.departement?.code || null
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
    return $piwik.value.optUserOut();
}

export function forgetOptOut() {
    return $piwik.value.forgetUserOptOut();
}

export function isOptedOut() {
    return $piwik.value.isUserOptedOut();
}

function formatUserForTracking(user) {
    const { organization } = user;
    const { type: orgType } = organization;
    const location = organization.location[organization.location.type];

    return JSON.stringify({
        superuser: user.is_superuser,
        is_admin: user.is_admin,
        role: user.role_id,
        org_id: organization.id,
        org_name: organization.abbreviation || user.organization.name,
        org_type: orgType.abbreviation || orgType.name_singular,
        org_category: organization.category.uid,
        org_location_type: organization.location.type,
        org_location_name: location?.name,
        org_location_code: location?.code,
    }).replace(/["{}]/g, "");
}
