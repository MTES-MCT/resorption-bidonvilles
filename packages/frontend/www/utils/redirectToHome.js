export default function redirectToHome() {
    if (globalThis.window !== undefined) {
        globalThis.window.location.href = '/';
    }
}