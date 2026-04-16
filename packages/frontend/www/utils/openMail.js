export default function openMail() {
    const { CONTACT_EMAIL } = useRuntimeConfig().public;
    if (globalThis.window !== undefined) {
        globalThis.window.location.href = `mailto:${CONTACT_EMAIL}`;
    }
}