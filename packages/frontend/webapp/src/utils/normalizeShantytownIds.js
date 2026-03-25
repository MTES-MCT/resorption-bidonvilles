// utils/normalizeShantytownIds.js
/**
 * Normalise et trie une liste d'ids de bidonvilles
 * Filtre les valeurs invalides et retourne un tableau d'entiers triés
 */
export function normalizeShantytownIds(shantytowns) {
    if (!shantytowns || !Array.isArray(shantytowns)) {
        return [];
    }

    return shantytowns
        .map((item) => {
            const raw =
                item !== null && typeof item === "object" ? item.id : item;
            return Number.parseInt(raw, 10);
        })
        .filter((id) => !Number.isNaN(id))
        .sort((a, b) => a - b);
}
