import { expect } from 'chai';

import metricsVersionKey from './metricsVersionKey';

/**
 * Contrat testé : `_common/metricsVersionKey.ts`
 *
 *   export default function metricsVersionKey(metricsAlias: string, versionAlias: string): string
 *
 * Fragment SQL partagé (fetchMetrics, fetchReport, moveMetricsToVersion) qui donne la clé de version d'une ligne
 * d'action_metrics : la date de la version si la ligne est rattachée à une version, sinon son created_at,
 * tronquée à la seconde.
 */
function normalize(sql: string): string {
    return sql.replace(/\s+/g, ' ').replace(/\(\s+/g, '(').replace(/\s+\)/g, ')').trim();
}

describe('models/actionModel/_common/metricsVersionKey()', () => {
    it('tronque à la seconde le COALESCE de la date de version et du created_at', () => {
        expect(normalize(metricsVersionKey('am', 'v'))).to.equal(
            'date_trunc(\'seconds\', COALESCE(v.version_at, am.created_at))',
        );
    });

    it('utilise les alias fournis (cas sans alias : nom de table complet)', () => {
        expect(normalize(metricsVersionKey('action_metrics', 'action_metrics_versions'))).to.equal(
            'date_trunc(\'seconds\', COALESCE(action_metrics_versions.version_at, action_metrics.created_at))',
        );
    });

    it('place la troncature autour du COALESCE (et non autour d\'un seul des deux opérandes)', () => {
        const sql = normalize(metricsVersionKey('am', 'v'));

        expect(sql).to.match(/^date_trunc\('seconds', COALESCE\(.+\)\)$/);
        expect(sql).not.to.match(/COALESCE\(date_trunc/);
    });

    it('ne contient aucun alias en dur', () => {
        const sql = metricsVersionKey('x', 'y');

        expect(sql).to.include('y.version_at');
        expect(sql).to.include('x.created_at');
        expect(sql).not.to.include('action_metrics');
    });
});
