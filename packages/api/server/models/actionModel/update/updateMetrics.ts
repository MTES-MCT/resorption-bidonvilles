import { Transaction } from 'sequelize';
import { ActionInput } from '#server/services/action/ActionInput.d';
import hasMetricValues from '#server/services/action/_common/hasMetricValues';
import fetchMetrics, { ActionMetricsRow } from '../fetch/fetchMetrics';
import insertMetrics from '../create/insertMetrics';
import createMetricsVersion from './createMetricsVersion';
import moveMetricsToVersion from './moveMetricsToVersion';
import deleteMetricsOutsideVersion from './deleteMetricsOutsideVersion';
import deleteOrphanMetricsVersions from './deleteOrphanMetricsVersions';

type YearIndicators = ActionInput['indicateurs'][string];

export type MetricsUpdatePlan = {
    hasChanges: boolean,
    keptYears: number[],
    yearsToWrite: string[],
};

const INDICATOR_KEYS: (keyof YearIndicators)[] = [
    'nombre_personnes',
    'nombre_menages',
    'nombre_femmes',
    'nombre_mineurs',
    'sante_nombre_personnes',
    'travail_nombre_personnes',
    'travail_nombre_femmes',
    'hebergement_nombre_personnes',
    'hebergement_nombre_menages',
    'logement_nombre_personnes',
    'logement_nombre_menages',
    'scolaire_mineurs_moins_de_trois_ans',
    'scolaire_mineurs_trois_ans_et_plus',
    'scolaire_mediation_moins_de_trois_ans',
    'scolaire_mediation_trois_ans_et_plus',
    'scolaire_nombre_maternelle',
    'scolaire_nombre_elementaire',
    'scolaire_nombre_college',
    'scolaire_nombre_lycee',
    'scolaire_nombre_autre',
    'scolaire_mineur_scolarise_dans_annee',
];

// null, undefined et chaîne vide sont équivalents (valeur non renseignée) ; 0 reste distinct de null
function normalize(value: number | string | null | undefined): number | null {
    if (value === null || value === undefined || value === '') {
        return null;
    }

    return Number(value);
}

// Le driver pg, via le parseur DATEONLY de Sequelize, renvoie la colonne `date` sous forme de chaîne
// `YYYY-MM-DD` (indépendante du fuseau) ; on accepte aussi un objet Date par robustesse.
function extractYear(date: string | Date): number {
    if (typeof date === 'string') {
        return Number.parseInt(date.slice(0, 4), 10);
    }

    return date.getFullYear();
}

function areIndicatorsEqual(existing: ActionMetricsRow, incoming: YearIndicators): boolean {
    return INDICATOR_KEYS.every(key => normalize(existing[key]) === normalize(incoming[key]));
}

// Des lignes de rang 1 dont tous les indicateurs sont vides existent en base. Le formulaire ne renvoie jamais
// une année sans valeur : on les ignore, pour qu'une sauvegarde sans changement n'écrive rien.
function isEmptyRow(row: ActionMetricsRow): boolean {
    return INDICATOR_KEYS.every(key => normalize(row[key]) === null);
}

/**
 * Compare les indicateurs actuels de l'action (lignes de rang 1 uniquement : les anciennes versions sont ignorées)
 * à ceux du formulaire, pour déterminer ce qui doit être conservé et ce qui doit être écrit.
 * Fonction pure : aucun accès à la base.
 */
export function planMetricsUpdate(currentRows: ActionMetricsRow[], incoming: ActionInput['indicateurs']): MetricsUpdatePlan {
    const currentByYear = new Map<number, ActionMetricsRow[]>();
    currentRows
        // RANK() est un bigint : pg le renvoie sous forme de chaîne
        .filter(row => Number(row.rank) === 1 && !isEmptyRow(row))
        .forEach((row) => {
            const year = extractYear(row.date);
            currentByYear.set(year, [...(currentByYear.get(year) ?? []), row]);
        });

    const keptYears: number[] = [];
    const yearsToWrite: string[] = [];
    const incomingYears = new Set<number>();

    Object.keys(incoming || {}).forEach((strYear) => {
        if (!hasMetricValues(incoming[strYear])) {
            return;
        }

        const year = Number.parseInt(strYear, 10);
        incomingYears.add(year);

        // une année présente en plusieurs lignes de rang 1 (données héritées) est toujours réécrite : on ne peut
        // pas conserver « la » ligne de cette année
        const rows = currentByYear.get(year);
        if (rows?.length === 1 && areIndicatorsEqual(rows[0], incoming[strYear])) {
            keptYears.push(year);
        } else {
            yearsToWrite.push(strYear);
        }
    });

    const hasRemovedYear = [...currentByYear.keys()].some(year => !incomingYears.has(year));

    return {
        hasChanges: yearsToWrite.length > 0 || hasRemovedYear,
        keptYears,
        yearsToWrite,
    };
}

export default async function updateMetrics(actionId: number, authorId: number, data: ActionInput, transaction: Transaction): Promise<void> {
    const currentRows = await fetchMetrics([actionId], {}, transaction);
    const { hasChanges, keptYears, yearsToWrite } = planMetricsUpdate(currentRows, data.indicateurs);

    // indicateurs inchangés : rien n'est écrit, donc created_at / created_by / version restent ceux d'origine
    if (!hasChanges) {
        return;
    }

    const versionId = await createMetricsVersion(actionId, authorId, transaction);

    if (keptYears.length > 0) {
        await moveMetricsToVersion(actionId, versionId, keptYears, transaction);
    }

    await deleteMetricsOutsideVersion(actionId, versionId, transaction);

    if (yearsToWrite.length > 0) {
        const indicateurs: ActionInput['indicateurs'] = {};
        yearsToWrite.forEach((year) => {
            indicateurs[year] = data.indicateurs[year];
        });

        await insertMetrics(actionId, authorId, { ...data, indicateurs }, transaction, versionId);
    }

    await deleteOrphanMetricsVersions(actionId, transaction);
}
