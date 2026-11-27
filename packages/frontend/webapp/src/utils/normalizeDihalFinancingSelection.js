export const ALL_YEARS_VALUE = "all";

/**
 * Normalise la sélection du filtre « Financement DIHAL » : « Toutes les années »
 * et les années précises sont mutuellement exclusives.
 *
 * La règle se déduit de la valeur qui vient d'être ajoutée (différence entre
 * l'ancienne et la nouvelle sélection). Ne mute pas ses entrées.
 *
 * @param {string[]|null|undefined} previous Sélection avant le changement
 * @param {string[]|null|undefined} next Sélection après le changement
 * @returns {string[]} Nouvelle sélection normalisée
 */
export default function normalizeDihalFinancingSelection(previous, next) {
    const previousSelection = Array.isArray(previous) ? previous : [];
    const nextSelection = Array.isArray(next) ? next : [];
    const addedValues = nextSelection.filter(
        (value) => !previousSelection.includes(value)
    );

    if (addedValues.includes(ALL_YEARS_VALUE)) {
        return [ALL_YEARS_VALUE];
    }

    if (addedValues.length > 0) {
        return nextSelection.filter((value) => value !== ALL_YEARS_VALUE);
    }

    return [...nextSelection];
}
