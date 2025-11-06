/**
 * Met en évidence tous les champs en erreur et scroll/focus sur le premier
 * Si aucun champ n'est trouvé, scroll vers le résumé des erreurs
 *
 * @param {Object} errors - Objet des erreurs de vee-validate
 * @param {string} errorSummaryId - ID de l'élément ErrorSummary
 */
export default async function focusFirstErrorField(
    errors,
    errorSummaryId = "erreurs"
) {
    // Attendre que le DOM soit mis à jour
    await new Promise((resolve) => setTimeout(resolve, 100));

    const errorKeys = Object.keys(errors);
    if (errorKeys.length === 0) {
        return;
    }

    // Mettre en évidence tous les champs en erreur
    const highlightedFields = [];

    for (const errorKey of errorKeys) {
        // Essayer de trouver l'élément par son ID
        let field = document.getElementById(errorKey);

        // Si non trouvé, essayer avec le préfixe du DatePicker (@vuepic/vue-datepicker)
        if (!field) {
            field = document.getElementById(`dp-input-${errorKey}`);
        }

        if (field) {
            highlightedFields.push(field);

            // Ajouter une classe CSS pour mettre en évidence le champ en erreur
            field.classList.add("field-error-highlight");

            // Ajouter un attribut data pour identifier les champs qu'on a mis en évidence
            field.setAttribute("data-error-highlighted", "true");
        }
    }

    // Scroll et focus sur le premier champ en erreur
    if (highlightedFields.length > 0) {
        const firstErrorField = highlightedFields[0];

        // Scroller vers le premier champ
        firstErrorField.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });

        // Attendre que le scroll soit terminé avant de focus
        setTimeout(() => {
            // Si c'est un input direct, on focus
            if (
                firstErrorField instanceof HTMLInputElement ||
                firstErrorField instanceof HTMLTextAreaElement ||
                firstErrorField instanceof HTMLSelectElement
            ) {
                firstErrorField.focus();
            } else {
                // Sinon, chercher un input à l'intérieur
                const input = firstErrorField.querySelector(
                    "input, textarea, select"
                );
                if (input) {
                    input.focus();
                }
            }
        }, 500);

        // Nettoyer les mises en évidence après 10 secondes ou au prochain focus
        const cleanupHighlights = () => {
            document
                .querySelectorAll('[data-error-highlighted="true"]')
                .forEach((el) => {
                    el.classList.remove("field-error-highlight");
                    el.removeAttribute("data-error-highlighted");
                });
        };

        // Nettoyer après 10 secondes
        setTimeout(cleanupHighlights, 10000);

        // Nettoyer au prochain focus sur un champ
        document.addEventListener("focusin", cleanupHighlights, { once: true });

        return;
    }

    // Fallback : focus sur le résumé des erreurs si aucun champ n'est trouvé
    const errorSummary = document.getElementById(errorSummaryId);
    if (errorSummary) {
        errorSummary.scrollIntoView({ behavior: "smooth", block: "start" });
        errorSummary.setAttribute("tabindex", "-1");
        errorSummary.focus();
    }
}
