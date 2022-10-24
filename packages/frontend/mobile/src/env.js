export default {
    VITE_MOBILE_HOST:
        import.meta.env.VITE_MOBILE_HOST || "${VITE_MOBILE_HOST}",
    VITE_MOBILE_API_HOST:
        import.meta.env.VITE_MOBILE_API_HOST || "${VITE_MOBILE_API_HOST}"
};
