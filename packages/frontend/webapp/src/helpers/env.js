// Log pour déboguer VITE_MATOMO_ENABLE - placé au début du module pour exécution
const rawMatomoEnableFromEnv = import.meta.env.VITE_MATOMO_ENABLE;
console.log(
    "[ENV Debug] Raw import.meta.env.VITE_MATOMO_ENABLE:",
    rawMatomoEnableFromEnv
);

const matomoEnableValueForCheck =
    rawMatomoEnableFromEnv || "${VITE_MATOMO_ENABLE}"; // Utilise la valeur brute ou le fallback
console.log(
    "[ENV Debug] Value used for MATOMO check (after || fallback):",
    matomoEnableValueForCheck
);

const isMatomoActuallyEnabled = matomoEnableValueForCheck === "true";
console.log(
    "[ENV Debug] Comparison result (isMatomoActuallyEnabled):",
    isMatomoActuallyEnabled
);

const MATOMO_CONFIG = {
    HOST: import.meta.env.VITE_MATOMO_HOST || "${VITE_MATOMO_HOST}",
    SITE_ID: import.meta.env.VITE_MATOMO_SITE_ID || "${VITE_MATOMO_SITE_ID}",
    DOMAIN: import.meta.env.VITE_MATOMO_DOMAIN || "${VITE_MATOMO_DOMAIN}",
    TRACKER_FILENAME:
        import.meta.env.VITE_MATOMO_TRACKER_FILENAME ||
        "${VITE_MATOMO_TRACKER_FILENAME}",
    DESCRIPTION_PAGE_SEPARATOR:
        import.meta.env.VITE_MATOMO_DESCRIPTION_PAGE_SEPARATOR ||
        "${VITE_MATOMO_DESCRIPTION_PAGE_SEPARATOR}",
};

const SENTRY_CONFIG = {
    DSN: import.meta.env.VITE_SENTRY_DSN || "${VITE_SENTRY_DSN}",
};

export default {
    WWW_URL: import.meta.env.VITE_WWW_URL || "${VITE_WWW_URL}",
    API_URL: import.meta.env.VITE_API_URL || "${VITE_API_URL}",
    CONTACT_EMAIL:
        import.meta.env.VITE_CONTACT_EMAIL || "${VITE_CONTACT_EMAIL}",
    MATOMO: isMatomoActuallyEnabled ? MATOMO_CONFIG : null,
    SENTRY:
        (import.meta.env.VITE_SENTRY_ENABLE || "${VITE_SENTRY_ENABLE}") ===
        "true"
            ? SENTRY_CONFIG
            : null,
};
