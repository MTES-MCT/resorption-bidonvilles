/**
 * Parmi des identifiants de champs, retourne celui dont l'élément apparaît en
 * premier dans le DOM (ordre d'affichage), et non dans l'ordre des clés d'un objet.
 * Les identifiants absents du DOM sont ignorés.
 *
 * @param {Array<string>} fieldIds
 * @returns {string|null}
 */
export function findFirstFieldIdInDomOrder(fieldIds) {
    let firstId = null;
    let firstElement = null;

    for (const fieldId of fieldIds || []) {
        const element = document.getElementById(fieldId);
        if (!element) {
            continue;
        }

        if (
            firstElement === null ||
            element.compareDocumentPosition(firstElement) &
                Node.DOCUMENT_POSITION_FOLLOWING
        ) {
            firstId = fieldId;
            firstElement = element;
        }
    }

    return firstId;
}

// Pour la section "indicateurs" (une seule clé d'erreur pour de nombreux inputs) :
// 1. cible explicite (id du champ fautif, fourni par l'appelant) si elle existe ;
// 2. sinon le premier input portant la classe "border-error" (secours) ;
// 3. sinon la section elle-même (premier input de la section).
function resolveErrorTarget(field, explicitTargetId) {
    if (explicitTargetId) {
        const explicitTarget = document.getElementById(explicitTargetId);
        if (explicitTarget) {
            return explicitTarget;
        }
    }

    if (field.id !== "indicateurs") {
        return field;
    }

    return (
        field.querySelector(
            "input.border-error, textarea.border-error, select.border-error"
        ) || field
    );
}

/**
 * Met en évidence tous les champs en erreur et scroll/focus sur le premier
 * Si aucun champ n'est trouvé, scroll vers le résumé des erreurs
 *
 * @param {Object} errors - Objet des erreurs de vee-validate
 * @param {string} errorSummaryId - ID de l'élément ErrorSummary
 * @param {Object<string, string>} explicitTargets - Cibles explicites { cléErreur: idDuChamp }
 *   qui remplacent la résolution par défaut pour cette clé (ex : indicateurs)
 */
export default async function focusFirstErrorField(
    errors,
    errorSummaryId = "erreurs",
    explicitTargets = {}
) {
    // Attendre que le DOM soit mis à jour
    await new Promise((resolve) => setTimeout(resolve, 100));

    const errorKeys = Object.keys(errors);
    if (errorKeys.length === 0) {
        return;
    }

    // Mettre en évidence tous les champs en erreur
    const highlightedFields = [];
    const highlightedKeys = [];

    for (const errorKey of errorKeys) {
        // Essayer de trouver l'élément par son ID
        let field = document.getElementById(errorKey);

        // Si non trouvé, essayer avec le préfixe du DatePicker (@vuepic/vue-datepicker)
        if (!field) {
            field = document.getElementById(`dp-input-${errorKey}`);
        }

        if (field) {
            highlightedFields.push(field);
            highlightedKeys.push(errorKey);

            // Ajouter une classe CSS pour mettre en évidence le champ en erreur
            field.classList.add("field-error-highlight");

            // Ajouter un attribut data pour identifier les champs qu'on a mis en évidence
            field.dataset.errorHighlighted = "true";
        }
    }

    // Scroll et focus sur le premier champ en erreur
    if (highlightedFields.length > 0) {
        const firstErrorField = resolveErrorTarget(
            highlightedFields[0],
            explicitTargets?.[highlightedKeys[0]]
        );

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
            for (const el of document.querySelectorAll(
                '[data-error-highlighted="true"]'
            )) {
                el.classList.remove("field-error-highlight");
                el.dataset.errorHighlighted = "false";
            }
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
        errorSummary.dataset.tabindex = "-1";
        errorSummary.focus();
    }
}
