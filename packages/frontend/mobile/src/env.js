const MATOMO = {
    HOST: import.meta.env.VITE_MATOMO_MOBILE_HOST || "${VITE_MATOMO_HOST}",
    SITE_ID:
        import.meta.env.VITE_MATOMO_MOBILE_SITE_ID || "${VITE_MATOMO_SITE_ID}",
    DOMAIN:
        import.meta.env.VITE_MATOMO_MOBILE_DOMAIN || "${VITE_MATOMO_DOMAIN}",
};

export default {
    VITE_MOBILE_HOST: import.meta.env.VITE_MOBILE_HOST || "${VITE_MOBILE_HOST}",
    VITE_MOBILE_API_HOST:
        import.meta.env.VITE_MOBILE_API_HOST || "${VITE_MOBILE_API_HOST}",
    MATOMO:
        (import.meta.env.VITE_MATOMO_MOBILE_ENABLE ||
            "${VITE_MATOMO_MOBILE_ENABLE}") === "true"
            ? MATOMO
            : null,
};
