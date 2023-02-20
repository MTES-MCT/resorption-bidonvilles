export default function (email = '', language = 'fr') {
    const { WEBAPP_URL, DOMAIN } = useRuntimeConfig();
    document.cookie = `device=webapp;domain=${DOMAIN}`;
    window.location = `${WEBAPP_URL}/contact?language=${encodeURIComponent(language)}${email ? `&email=${encodeURIComponent(email)}` : ""
        }`;
}