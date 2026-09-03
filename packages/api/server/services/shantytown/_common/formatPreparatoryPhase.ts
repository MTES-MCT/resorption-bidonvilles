import dateUtils from '#server/utils/date';
import formatDate from '#server/utils/formatDate';

/**
 * Formate une phase préparatoire à la résorption en texte lisible.
 *
 * @param phase - Phase contenant au minimum :
 *   - preparatoryPhaseName: nom de la phase (ex: "Diagnostic sociologique")
 *   - preparatoryPhaseDateLabel: label de date (ex: "Réalisé le")
 *   - completedAt: date ISO 8601 string (ex: "2024-01-15T00:00:00.000Z") ou null si en cours
 * @returns Texte formaté "Nom de la phase : réalisé le JJ/MM/AAAA" ou "Nom de la phase : en cours"
 *
 * Note : cette fonction ne retourne QUE le texte de la phase, sans préfixe (-, puce, etc.).
 * Chaque consommateur est responsable d'ajouter son propre préfixe/mise en forme.
 */
const formatPreparatoryPhase = (phase: {
    preparatoryPhaseName: string;
    preparatoryPhaseDateLabel: string;
    completedAt: string | null;
}): string => {
    const { preparatoryPhaseName, preparatoryPhaseDateLabel, completedAt } = phase;

    if (!completedAt) {
        return `${preparatoryPhaseName} : en cours`;
    }

    // Convertir la string ISO 8601 en timestamp (millisecondes), puis en secondes, puis formater en JJ/MM/AAAA (en UTC)
    const timestampMs = dateUtils.toTimestamp(completedAt);
    const timestampSec = timestampMs / 1000;
    const formattedDate = formatDate(timestampSec, 'd/m/y');

    return `${preparatoryPhaseName} : ${preparatoryPhaseDateLabel.toLowerCase()} ${formattedDate}`;
};

export default formatPreparatoryPhase;
