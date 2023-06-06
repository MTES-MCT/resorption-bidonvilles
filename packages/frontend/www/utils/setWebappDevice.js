export default function () {
    const { DOMAIN } = useRuntimeConfig().public;
    document.cookie = `device=webapp;domain=${DOMAIN}`;
}
