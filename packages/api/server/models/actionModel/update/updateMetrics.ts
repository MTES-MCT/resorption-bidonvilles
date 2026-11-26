import { Transaction } from 'sequelize';
import { ActionInput } from '#server/services/action/ActionInput.d';
import hasMetricValues from '#server/services/action/_common/hasMetricValues';
import fetchMetrics, { ActionMetricsRow } from '../fetch/fetchMetrics';
import insertMetrics from '../create/insertMetrics';
import createMetricsVersion from './createMetricsVersion';
import moveMetricsToVersion from './moveMetricsToVersion';
import deleteMetricsOutsideVersion from './deleteMetricsOutsideVersion';
import deleteOrphanMetricsVersions from './deleteOrphanMetricsVersions';
import {
    INDICATOR_KEYS, SCOLAIRE_KEYS, NON_SCOLAIRE_KEYS, hasAnyValue,
} from '../_common/indicatorKeys';

type YearIndicators = ActionInput['indicateurs'][string];

export type MetricsUpdatePlan = {
    hasChanges: boolean,
    keptYears: number[],
    yearsToWrite: string[],
    datesByYear: Record<string, MetricsNatureDates>,
};

export type MetricsNatureDates = {
    updated_at_indicators: Date | null,
    updated_at_scolaire: Date | null,
};

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

function areKeysEqual(existing: ActionMetricsRow, incoming: YearIndicators, keys: (keyof YearIndicators)[]): boolean {
    return keys.every(key => normalize(existing[key]) === normalize(incoming[key]));
}

function natureDate(
    existing: ActionMetricsRow | undefined,
    incoming: YearIndicators,
    keys: (keyof YearIndicators)[],
    previousDate: Date | null | undefined,
    now: Date,
): Date | null {
    // nature entièrement vide dans le formulaire et déjà vide avant (ou année nouvelle) : aucune date
    const isEmptyNow = !hasAnyValue(incoming, keys);
    if (existing === undefined || (isEmptyNow && !hasAnyValue(existing, keys))) {
        return isEmptyNow ? null : now;
    }

    // nature inchangée : on reporte la date de l'ancienne ligne ; modifiée : date du jour
    return areKeysEqual(existing, incoming, keys) ? (previousDate ?? null) : now;
}

// Dates de fraîcheur par nature d'une année réécrite. Une année présente en plusieurs lignes de rang 1 (données
// héritées) est traitée comme nouvelle : date du jour pour toute nature renseignée.
function computeNatureDates(rows: ActionMetricsRow[] | undefined, incoming: YearIndicators, now: Date): MetricsNatureDates {
    const existing = rows?.length === 1 ? rows[0] : undefined;

    return {
        updated_at_indicators: natureDate(existing, incoming, NON_SCOLAIRE_KEYS, existing?.updated_at_indicators, now),
        updated_at_scolaire: natureDate(existing, incoming, SCOLAIRE_KEYS, existing?.updated_at_scolaire, now),
    };
}

/**
 * Compare les indicateurs actuels de l'action (lignes de rang 1 uniquement : les anciennes versions sont ignorées)
 * à ceux du formulaire, pour déterminer ce qui doit être conservé et ce qui doit être écrit.
 * Fonction pure : aucun accès à la base.
 */
export function planMetricsUpdate(currentRows: ActionMetricsRow[], incoming: ActionInput['indicateurs'], now: Date = new Date()): MetricsUpdatePlan {
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
    const datesByYear: Record<string, MetricsNatureDates> = {};
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
            datesByYear[strYear] = computeNatureDates(rows, incoming[strYear], now);
        }
    });

    const hasRemovedYear = [...currentByYear.keys()].some(year => !incomingYears.has(year));

    return {
        hasChanges: yearsToWrite.length > 0 || hasRemovedYear,
        keptYears,
        yearsToWrite,
        datesByYear,
    };
}

export default async function updateMetrics(actionId: number, authorId: number, data: ActionInput, transaction: Transaction): Promise<void> {
    const currentRows = await fetchMetrics([actionId], {}, transaction);
    const {
        hasChanges, keptYears, yearsToWrite, datesByYear,
    } = planMetricsUpdate(currentRows, data.indicateurs);

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

        await insertMetrics(actionId, authorId, { ...data, indicateurs }, transaction, versionId, datesByYear);
    }

    await deleteOrphanMetricsVersions(actionId, transaction);
}
