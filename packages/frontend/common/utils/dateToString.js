/**
 * Convertit un objet Date en chaîne YYYY-MM-DD en utilisant l'heure LOCALE.
 * Cela garantit que la date saisie par l'utilisateur est celle envoyée au backend.
 *
 * IMPORTANT: NE PAS utiliser date.toISOString() pour les dates calendaires car
 * cela convertit en UTC et peut décaler d'un jour (ex: minuit en France = 22h UTC la veille).
 *
 * @param {Date} date - Objet Date à convertir
 * @returns {string|null} Date au format YYYY-MM-DD ou null si invalide
 *
 * @example
 * // Utilisateur en France sélectionne "11 août 2025"
 * const date = new Date(2025, 7, 11); // Minuit heure locale
 * dateToString(date); // "2025-08-11" ✅
 * // Au lieu de:
 * date.toISOString().slice(0, 10); // "2025-08-10" ❌ (car minuit France = 22h UTC veille)
 */
export default function dateToString(date) {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
        return null;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}
