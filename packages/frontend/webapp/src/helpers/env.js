const MATOMO = {
    HOST: import.meta.env.VITE_MATOMO_HOST || "${VITE_MATOMO_HOST}",
    SITE_ID: import.meta.env.VITE_MATOMO_SITE_ID || "${VITE_MATOMO_SITE_ID}",
    DOMAIN: import.meta.env.VITE_MATOMO_DOMAIN || "${VITE_MATOMO_DOMAIN}",
};

const SENTRY = {
    DSN: import.meta.env.VITE_SENTRY_DSN || "${VITE_SENTRY_DSN}",
};

export default {
    WWW_URL: import.meta.env.VITE_WWW_URL || "${VITE_WWW_URL}",
    WEBAPP_URL: import.meta.env.VITE_WEBAPP_URL || "${VITE_WEBAPP_URL}",
    API_URL: import.meta.env.VITE_API_URL || "${VITE_API_URL}",
    MOBILE_URL: import.meta.env.VITE_MOBILE_URL || "${VITE_MOBILE_URL}",
    WEBAPP_DOMAIN:
        import.meta.env.VITE_WEBAPP_DOMAIN || "${VITE_WEBAPP_DOMAIN}",
    CONTACT_EMAIL:
        import.meta.env.VITE_CONTACT_EMAIL || "${VITE_CONTACT_EMAIL}",
    MATOMO:
        (import.meta.env.VITE_MATOMO_ENABLE || "${VITE_MATOMO_ENABLE}") ===
        "true"
            ? MATOMO
            : null,
    SENTRY:
        (import.meta.env.VITE_SENTRY_ENABLE || "${VITE_SENTRY_ENABLE}") ===
        "true"
            ? SENTRY
            : null,
};
