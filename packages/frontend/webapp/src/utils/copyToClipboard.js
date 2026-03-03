export default async function (value) {
    try {
        await navigator.clipboard.writeText(value);
        return true;
    } catch {
        // Fallback pour navigateurs anciens
        const input = document.createElement("textarea");
        input.value = value;
        document.body.appendChild(input);
        input.select();
        const success = document.execCommand("copy");
        document.body.removeChild(input);
        return success;
    }
}
