import { cloneDeep } from "lodash-es";

const FIELD_MESSAGE_REGEX = /^FIELD:([^|]+)\|MESSAGE:(.+)$/;

// Chemin yup d'une erreur d'indicateurs : "indicateurs.2024.nom_du_champ"
// (ou indicateurs["2024"].nom_du_champ selon la version de yup).
const YEAR_PATH_REGEX = /^indicateurs(?:\.|\[")(\d+)/;

// Clé sous laquelle sont rangés les messages sans préfixe "FIELD:..." (repli).
export const FALLBACK_ERROR_KEY = "indicateurs";

// Clé de regroupement des erreurs d'indicateurs qui ne portent aucune année
// (ex : erreur posée sur l'objet "indicateurs" lui-même).
export const GENERAL_YEAR_KEY = "general";

/**
 * Transforme le tableau plat de messages yup des indicateurs en objet
 * { nomDuChamp: message } pour l'affichage inline.
 *
 * Les messages au format "FIELD:nom|MESSAGE:texte" sont rattachés à leur champ.
 * Les autres (règle sans préfixe) ne sont jamais jetés : ils sont regroupés
 * sous FALLBACK_ERROR_KEY pour rester visibles dans le résumé d'erreurs.
 *
 * @param {Array<string>} messages
 * @returns {Object<string, string>}
 */
export default function parseIndicateursErrors(messages) {
    const fieldErrors = {};
    const fallbackMessages = [];

    for (const msg of messages || []) {
        if (typeof msg !== "string") {
            continue;
        }

        const match = FIELD_MESSAGE_REGEX.exec(msg);
        if (match) {
            fieldErrors[match[1]] = match[2];
        } else if (!fallbackMessages.includes(msg)) {
            fallbackMessages.push(msg);
        }
    }

    if (fallbackMessages.length > 0) {
        fieldErrors[FALLBACK_ERROR_KEY] = fallbackMessages.join(" ");
    }

    return fieldErrors;
}

/**
 * Regroupe par année les erreurs yup des indicateurs.
 *
 * `validate()` de vee-validate ne restitue qu'une liste de messages sans chemin :
 * l'année est donc lue sur le chemin des ValidationError.inner de yup
 * ("indicateurs.2024.champ"). Deux années en erreur sur un même champ restent
 * distinctes, puisque le regroupement se fait d'abord par année.
 *
 * @param {Array<{path?: string, errors?: Array<string>}>} innerErrors
 * @returns {Object<string, Object<string, string>>} { année: { champ: message } }
 */
export function groupIndicateursErrorsByYear(innerErrors) {
    const messagesByYear = {};

    for (const { path, errors } of innerErrors || []) {
        if (typeof path !== "string" || !path.startsWith("indicateurs")) {
            continue;
        }

        const match = YEAR_PATH_REGEX.exec(path);
        const yearKey = match ? match[1] : GENERAL_YEAR_KEY;
        if (!messagesByYear[yearKey]) {
            messagesByYear[yearKey] = [];
        }
        messagesByYear[yearKey].push(...(errors || []));
    }

    return Object.keys(messagesByYear).reduce((acc, yearKey) => {
        acc[yearKey] = parseIndicateursErrors(messagesByYear[yearKey]);
        return acc;
    }, {});
}

/**
 * Valide directement avec yup (abortEarly: false) pour conserver le chemin
 * de chaque erreur, puis les regroupe par année.
 *
 * @param {import("yup").Schema} schema Schéma racine du formulaire
 * @param {Object} values Valeurs du formulaire
 * @returns {Promise<Object<string, Object<string, string>>>}
 */
export async function collectIndicateursErrors(schema, values) {
    const snapshot = cloneDeep(values);

    try {
        await schema.validate(snapshot, {
            abortEarly: false,
            context: snapshot,
        });
        return {};
    } catch (error) {
        if (error?.name !== "ValidationError") {
            throw error;
        }

        const innerErrors = error.inner?.length > 0 ? error.inner : [error];
        return groupIndicateursErrorsByYear(innerErrors);
    }
}

/**
 * Libellé lisible de l'année, identique à celui affiché par le formulaire :
 * "Année scolaire N-1 - N" pour les champs scolaires (cf. InputIndicateursScolaires),
 * "Année N" sinon (cf. "Résultats pour l'année N" d'InputIndicateurs).
 *
 * @param {number|string} year
 * @param {string} [field]
 * @returns {string}
 */
export function formatIndicateursYearLabel(year, field) {
    const numericYear = Number.parseInt(year, 10);

    if (typeof field === "string" && field.startsWith("scolaire_")) {
        return `Année scolaire ${numericYear - 1} - ${numericYear}`;
    }

    return `Année ${numericYear}`;
}

/**
 * Préfixe le message avec l'année concernée : "Année 2024 : message".
 */
export function formatIndicateursYearError(year, field, message) {
    return `${formatIndicateursYearLabel(year, field)} : ${message}`;
}

/**
 * Années en erreur, de la plus ancienne à la plus récente (ordre de
 * navigation d'InputIndicateurs : "Année précédente" / "Année suivante").
 *
 * @param {Object<string, Object<string, string>>} errorsByYear
 * @returns {Array<number>}
 */
export function getIndicateursYearsInError(errorsByYear) {
    return Object.keys(errorsByYear || {})
        .filter((key) => key !== GENERAL_YEAR_KEY)
        .map((key) => Number.parseInt(key, 10))
        .filter((year) => !Number.isNaN(year))
        .sort((a, b) => a - b);
}

/**
 * Année à afficher après une soumission rejetée : on garde l'année affichée
 * si elle est déjà en erreur (pas de saut inutile), sinon la plus ancienne
 * année en erreur comprise dans la plage navigable.
 *
 * @returns {number|null} null si aucune année en erreur n'est affichable
 */
export function pickYearToDisplay(yearsInError, currentYear, minYear, maxYear) {
    const displayable = (yearsInError || []).filter(
        (year) => year >= minYear && year <= maxYear
    );

    if (displayable.length === 0) {
        return null;
    }

    return displayable.includes(currentYear) ? currentYear : displayable[0];
}

/**
 * Construit le contenu du résumé d'erreurs (ErrorSummary).
 * Clé : "indicateurs-ANNÉE-champ" (unique par année et par champ), valeur :
 * message préfixé de l'année. Les erreurs sans année sont rangées sous leur
 * champ (ou "indicateurs" pour le repli) sans préfixe.
 *
 * @param {Object<string, Object<string, string>>} errorsByYear
 * @returns {Object<string, string>}
 */
export function buildIndicateursSummary(errorsByYear) {
    const summary = {};

    for (const year of getIndicateursYearsInError(errorsByYear)) {
        const fieldErrors = errorsByYear[year];
        for (const field of Object.keys(fieldErrors)) {
            summary[`indicateurs-${year}-${field}`] =
                formatIndicateursYearError(year, field, fieldErrors[field]);
        }
    }

    const generalErrors = errorsByYear?.[GENERAL_YEAR_KEY] || {};
    for (const field of Object.keys(generalErrors)) {
        summary[field] = generalErrors[field];
    }

    return summary;
}

/**
 * Décode une clé du résumé ("indicateurs-2024-champ").
 *
 * @param {string} key
 * @returns {{year: number, field: string}|null}
 */
export function parseIndicateursSummaryKey(key) {
    const match = /^indicateurs-(\d+)-(.+)$/.exec(key || "");
    if (!match) {
        return null;
    }

    return { year: Number.parseInt(match[1], 10), field: match[2] };
}
