/**
 * Focus sur un champ par son ID avec scroll smooth
 * @param {string} fieldId - ID du champ
 */
export default function focusFieldById(fieldId) {
    let field = document.getElementById(fieldId);
    if (!field) {
        field = document.getElementById(`dp-input-${fieldId}`);
    }

    if (!field) {
        return false;
    }

    field.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => {
        const focusable =
            field instanceof HTMLInputElement ||
            field instanceof HTMLTextAreaElement ||
            field instanceof HTMLSelectElement
                ? field
                : field.querySelector("input, textarea, select");
        focusable?.focus({ preventScroll: true });
    }, 500);

    return true;
}
