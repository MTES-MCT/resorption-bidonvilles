const MATOMO = {
    HOST:
        import.meta.env.VITE_MOBILE_MATOMO_HOST || "${VITE_MOBILE_MATOMO_HOST}",
    SITE_ID:
        import.meta.env.VITE_MOBILE_MATOMO_SITE_ID ||
        "${VITE_MOBILE_MATOMO_SITE_ID}",
    DOMAIN:
        import.meta.env.VITE_MOBILE_MATOMO_DOMAIN ||
        "${VITE_MOBILE_MATOMO_DOMAIN}",
    TRACKER_FILENAME:
        import.meta.env.VITE_MOBILE_MATOMO_TRACKER_FILENAME ||
        "${VITE_MOBILE_MATOMO_TRACKER_FILENAME}",
    DESCRIPTION_PAGE_SEPARATOR:
        import.meta.env.VITE_MOBILE_MATOMO_DESCRIPTION_PAGE_SEPARATOR ||
        "${VITE_MOBILE_MATOMO_DESCRIPTION_PAGE_SEPARATOR}",
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
    VITE_MOBILE_DOMAIN:
        import.meta.env.VITE_MOBILE_DOMAIN || "${VITE_MOBILE_DOMAIN}",
    VITE_WEBAPP_URL: import.meta.env.VITE_WEBAPP_URL || "${VITE_WEBAPP_URL}",
};
