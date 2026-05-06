/**
 * Focus sur un champ par son ID avec scroll smooth
 * @param {string} fieldId - ID du champ
 */
export default function focusFieldById(fieldId) {
    if (typeof fieldId !== 'string' || fieldId.trim() === '') {
        return false;
    }

    // Essayer d'abord avec l'ID exact
    let field = document.getElementById(fieldId);
    
    // Essayer avec le préfixe dp-input-
    if (!field) {
        field = document.getElementById(`dp-input-${fieldId}`);
    }
    
    // Si toujours pas trouvé, essayer avec un sélecteur CSS échappé
    if (!field && typeof CSS !== 'undefined' && typeof CSS.escape === 'function') {
        // Échapper les caractères spéciaux pour le sélecteur CSS
        const escapedId = CSS.escape(fieldId);
        field = document.querySelector(`#${escapedId}`);
    }
    
    // Si toujours pas trouvé, essayer avec les underscores (format transformé)
    if (!field) {
        try {
            // Remplacer les crochets et les points par des underscores, puis nettoyer les doubles underscores
            const underscoredId = fieldId.replaceAll(/[[\].]/g, '_').replaceAll(/__+/g, '_');
            field = document.getElementById(underscoredId);
        } catch {
            // do nothing
        }
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
