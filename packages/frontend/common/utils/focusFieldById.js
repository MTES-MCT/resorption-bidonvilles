/**
 * Focus sur un champ par son ID avec scroll smooth
 * @param {string} fieldId - ID du champ
 */
export default function focusFieldById(fieldId) {
    // Essayer d'abord avec l'ID exact
    let field = document.getElementById(fieldId);
    
    // Essayer avec le préfixe dp-input-
    if (!field) {
        field = document.getElementById(`dp-input-${fieldId}`);
    }
    
    // Si toujours pas trouvé, essayer avec un sélecteur CSS échappé
    if (!field) {
        try {
            // Échapper les caractères spéciaux pour le sélecteur CSS
            const escapedId = CSS.escape(fieldId);
            field = document.querySelector(`#${escapedId}`);
        } catch (e) {
        }
    }
    
    // Si toujours pas trouvé, essayer avec les underscores (format transformé)
    if (!field) {
        try {
            // Remplacer les crochets et les points par des underscores, puis nettoyer les doubles underscores
            const underscoredId = fieldId.replace(/[\[\]\.]/g, '_').replace(/__+/g, '_');
            field = document.getElementById(underscoredId);
        } catch (e) {
            console.warn(`Could not find field with underscored id: ${fieldId}`, e);
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
