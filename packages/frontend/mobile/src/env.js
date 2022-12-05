const MATOMO = {
    HOST:
        import.meta.env.VITE_MOBILE_MATOMO_HOST || "${VITE_MOBILE_MATOMO_HOST}",
    SITE_ID:
        import.meta.env.VITE_MOBILE_MATOMO_SITE_ID ||
        "${VITE_MOBILE_MATOMO_SITE_ID}",
    DOMAIN:
        import.meta.env.VITE_MOBILE_MATOMO_DOMAIN ||
        "${VITE_MOBILE_MATOMO_DOMAIN}",
};

export default {
    VITE_MOBILE_HOST: import.meta.env.VITE_MOBILE_HOST || "${VITE_MOBILE_HOST}",
    VITE_MOBILE_API_HOST:
        import.meta.env.VITE_MOBILE_API_HOST || "${VITE_MOBILE_API_HOST}",
    VITE_MOBILE_MATOMO:
        (import.meta.env.VITE_MOBILE_MATOMO_ENABLE ||
            "${VITE_MOBILE_MATOMO_ENABLE}") === "true"
            ? MATOMO
            : null,
};
