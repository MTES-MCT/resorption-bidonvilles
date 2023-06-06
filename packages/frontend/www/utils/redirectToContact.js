export default function (email = '', language = 'fr') {
    const { WEBAPP_URL, DOMAIN } = useRuntimeConfig().public;
    document.cookie = `device=webapp;domain=${DOMAIN}`;
    window.location = `${WEBAPP_URL}/contact?language=${encodeURIComponent(language)}${email ? `&email=${encodeURIComponent(email)}` : ""
        }`;
}