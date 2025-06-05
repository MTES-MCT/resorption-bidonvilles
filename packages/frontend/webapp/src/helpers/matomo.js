import VueMatomo from "vue-matomo";
import { computed } from "vue";
import ENV from "@/helpers/env.js";

// const { MATOMO } = ENV; // Supprimé pour utiliser ENV.MATOMO directement dans useMatomo
const $piwik = computed(() => {
    return typeof window !== "undefined" ? window.Piwik?.getTracker() : null;
});

export function useMatomo(app, router) {
    // Accéder à ENV.MATOMO directement ici
    if (!ENV.MATOMO) {
        console.warn(
            "[Matomo Debug] Matomo not initialized because ENV.MATOMO is not defined.",
            ENV.MATOMO
        );
        return;
    }

    // Logguer la valeur et le type de ENABLE avant de comparer
    console.log(
        "[Matomo Debug] Checking ENV.MATOMO.ENABLE: ",
        `'${ENV.MATOMO.ENABLE}'`,
        "(type:",
        typeof ENV.MATOMO.ENABLE,
        ")"
    );

    // Utiliser .trim() pour enlever les espaces potentiels avant la comparaison
    if (
        typeof ENV.MATOMO.ENABLE !== "string" ||
        ENV.MATOMO.ENABLE.trim() !== "true"
    ) {
        console.warn(
            "[Matomo Debug] Matomo not initialized because ENV.MATOMO.ENABLE is not 'true'. Actual value:",
            `'${ENV.MATOMO.ENABLE}'` // Affiche la valeur avec des apostrophes pour voir les espaces
        );
        return;
    }

    console.log(
        "[Matomo Debug] Conditions passed, proceeding with Matomo initialization."
    ); // Nouveau log

    // Si on utilise le serveur matomo DNUM, il faut modifier l'URL
    // avant l'envoi à Matomo pour rester compatible avec Xiti
    // Le séparateur original "/" est remplacé par "::"
    // Utiliser ENV.MATOMO au lieu de la variable MATOMO déstructurée
    if (
        typeof ENV.MATOMO.DESCRIPTION_PAGE_SEPARATOR !== "undefined" &&
        ENV.MATOMO.DESCRIPTION_PAGE_SEPARATOR !== "/"
    ) {
        router.beforeTrack = (to) => {
            const modifiedPath = to.fullPath.replace(
                /\//g,
                ENV.MATOMO.DESCRIPTION_PAGE_SEPARATOR
            );
            return { ...to, fullPath: modifiedPath };
        };
    }
    const matomoConfig = {
        host: ENV.MATOMO.HOST,
        siteId: ENV.MATOMO.SITE_ID,
        router,
        trackInitialView: false,
        cookieDomain: `*.${ENV.MATOMO.DOMAIN}`,
        domains: `*.${ENV.MATOMO.DOMAIN}`,
        trackerFileName: ENV.MATOMO.TRACKER_FILENAME,
        debug: true,
    };
    console.log(
        "[Matomo Debug] Initializing VueMatomo with config:",
        matomoConfig
    );
    app.use(VueMatomo, matomoConfig);
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

export function trackEvent(category, action, name, value) {
    if (typeof window === "undefined") {
        console.warn(
            "[Matomo Debug] trackEvent called in non-browser environment."
        );
        return;
    }

    // Assure que window._paq est initialisé comme un tableau
    window._paq = window._paq || [];

    const eventDetails = ["trackEvent", category, action];

    // Ajoute name et value seulement s'ils sont définis, car Matomo les attend dans cet ordre.
    if (name !== undefined) {
        eventDetails.push(name);
        if (value !== undefined) {
            eventDetails.push(value);
        }
    }

    console.log("[Matomo Debug] Pushing to _paq:", eventDetails);
    window._paq.push(eventDetails);
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
