export default function (email = '') {
    const { WEBAPP_URL, DOMAIN } = useRuntimeConfig();
    document.cookie = `device=webapp;domain=${DOMAIN}`;
    window.location = `${WEBAPP_URL}/contact${email ? `?email=${encodeURIComponent(email)}` : ""
        }`;
}