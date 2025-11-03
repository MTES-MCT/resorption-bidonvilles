/**
 * Scroll et focus automatiquement sur le premier champ en erreur
 * Si le champ n'est pas trouvé, scroll vers le résumé des erreurs
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

    // Récupérer le premier champ en erreur
    const firstErrorKey = Object.keys(errors)[0];

    if (firstErrorKey) {
        // Essayer de trouver l'élément par son ID
        let firstErrorField = document.getElementById(firstErrorKey);

        // Si non trouvé, essayer avec le préfixe du DatePicker (@vuepic/vue-datepicker)
        if (!firstErrorField) {
            firstErrorField = document.getElementById(
                `dp-input-${firstErrorKey}`
            );
        }

        if (firstErrorField) {
            // Scroller vers le champ
            firstErrorField.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });

            // Attendre que le scroll soit terminé avant de focus
            setTimeout(() => {
                // Si c'est un input direct, on focus
                if (
                    firstErrorField.tagName === "INPUT" ||
                    firstErrorField.tagName === "TEXTAREA" ||
                    firstErrorField.tagName === "SELECT"
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
            return;
        }
    }

    // Fallback : focus sur le résumé des erreurs si le champ n'est pas trouvé
    const errorSummary = document.getElementById(errorSummaryId);
    if (errorSummary) {
        errorSummary.scrollIntoView({ behavior: "smooth", block: "start" });
        errorSummary.setAttribute("tabindex", "-1");
        errorSummary.focus();
    }
}
