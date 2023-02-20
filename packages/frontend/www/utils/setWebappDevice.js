export default function () {
    const { DOMAIN } = useRuntimeConfig();
    document.cookie = `device=webapp;domain=${DOMAIN}`;
}
