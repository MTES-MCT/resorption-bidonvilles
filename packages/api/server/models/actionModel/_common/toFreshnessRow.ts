import { ActionMetricsRow } from '../fetch/fetchMetrics';
import { FreshnessRow } from './computeIndicatorsFreshness';
import { SCOLAIRE_KEYS, NON_SCOLAIRE_KEYS, hasAnyValue } from './indicatorKeys';

/**
 * Convertit une ligne d'indicateurs en ligne de fraîcheur. Une nature (scolaire ou non) sans aucune valeur sur la
 * ligne, ou sans date de mise à jour, n'a pas de date de mise à jour.
 */
export default function toFreshnessRow(row: ActionMetricsRow): FreshnessRow {
    return {
        year: Number.parseInt(String(row.date).slice(0, 4), 10),
        indicators_updated_at: hasAnyValue(row, NON_SCOLAIRE_KEYS) && row.updated_at_indicators ? new Date(row.updated_at_indicators).getTime() : null,
        scolaire_updated_at: hasAnyValue(row, SCOLAIRE_KEYS) && row.updated_at_scolaire ? new Date(row.updated_at_scolaire).getTime() : null,
    };
}
