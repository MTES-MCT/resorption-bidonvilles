import { expect } from 'chai';

import toFreshnessRow from './toFreshnessRow';
import { ActionMetricsRow } from '../fetch/fetchMetrics';
import { INDICATOR_KEYS, SCOLAIRE_KEYS, NON_SCOLAIRE_KEYS } from './indicatorKeys';

/**
 * Contrat testé : `_common/toFreshnessRow.ts`
 *
 *   export default function toFreshnessRow(row: ActionMetricsRow): FreshnessRow
 *
 *   - year                  : Number.parseInt(String(row.date).slice(0, 4), 10) ;
 *   - indicators_updated_at : row.updated_at_indicators en ms, SEULEMENT si la ligne a au moins une valeur parmi
 *                             NON_SCOLAIRE_KEYS (hasAnyValue), sinon null ;
 *   - scolaire_updated_at   : idem avec SCOLAIRE_KEYS et row.updated_at_scolaire.
 * Une date de mise à jour absente (null) donne null. 0 est une valeur ; null, undefined et '' n'en sont pas.
 */
const INDICATORS_DATE = new Date(2026, 2, 10, 8, 0, 0, 0);
const SCOLAIRE_DATE = new Date(2026, 4, 20, 9, 30, 0, 0);

function buildRow(overrides: Record<string, unknown> = {}): ActionMetricsRow {
    const empty = INDICATOR_KEYS.reduce((acc, key) => {
        acc[key] = null;
        return acc;
    }, {} as Record<string, unknown>);

    return {
        rank: 1,
        version_at: new Date(2026, 0, 1),
        updated_at_indicators: INDICATORS_DATE,
        updated_at_scolaire: SCOLAIRE_DATE,
        action_id: 1,
        date: '2025-12-31',
        ...empty,
        ...overrides,
    } as unknown as ActionMetricsRow;
}

describe('models/actionModel/_common/toFreshnessRow()', () => {
    describe('year', () => {
        it('extrait l\'année des quatre premiers caractères de la date', () => {
            expect(toFreshnessRow(buildRow({ date: '2025-12-31' })).year).to.eql(2025);
            expect(toFreshnessRow(buildRow({ date: '2019-01-01' })).year).to.eql(2019);
        });

        it('retourne un nombre', () => {
            expect(toFreshnessRow(buildRow({ date: '2024-06-15' })).year).to.be.a('number');
        });
    });

    describe('nature non scolaire', () => {
        NON_SCOLAIRE_KEYS.forEach((key) => {
            it(`${key} renseigné : indicators_updated_at est la date en ms et scolaire_updated_at est null`, () => {
                const result = toFreshnessRow(buildRow({ [key]: 12 }));

                expect(result.indicators_updated_at).to.eql(INDICATORS_DATE.getTime());
                expect(result.scolaire_updated_at).to.be.null;
            });
        });
    });

    describe('nature scolaire', () => {
        SCOLAIRE_KEYS.forEach((key) => {
            it(`${key} renseigné : scolaire_updated_at est la date en ms et indicators_updated_at est null`, () => {
                const result = toFreshnessRow(buildRow({ [key]: 7 }));

                expect(result.scolaire_updated_at).to.eql(SCOLAIRE_DATE.getTime());
                expect(result.indicators_updated_at).to.be.null;
            });
        });
    });

    describe('valeurs', () => {
        it('compte 0 comme une valeur, pour chaque nature', () => {
            const result = toFreshnessRow(buildRow({ nombre_personnes: 0, scolaire_nombre_college: 0 }));

            expect(result.indicators_updated_at).to.eql(INDICATORS_DATE.getTime());
            expect(result.scolaire_updated_at).to.eql(SCOLAIRE_DATE.getTime());
        });

        it('ne compte pas null, undefined ni la chaîne vide comme des valeurs', () => {
            const result = toFreshnessRow(buildRow({
                nombre_personnes: null,
                nombre_menages: undefined,
                nombre_femmes: '',
                scolaire_nombre_lycee: null,
                scolaire_nombre_autre: undefined,
                scolaire_nombre_college: '',
            }));

            expect(result.indicators_updated_at).to.be.null;
            expect(result.scolaire_updated_at).to.be.null;
        });

        it('retourne null pour les deux natures quand la ligne est entièrement vide, même avec des dates renseignées', () => {
            const result = toFreshnessRow(buildRow());

            expect(result.indicators_updated_at).to.be.null;
            expect(result.scolaire_updated_at).to.be.null;
        });

        it('retourne les deux dates quand les deux natures ont une valeur', () => {
            const result = toFreshnessRow(buildRow({ nombre_personnes: 10, scolaire_nombre_maternelle: 3 }));

            expect(result.indicators_updated_at).to.eql(INDICATORS_DATE.getTime());
            expect(result.scolaire_updated_at).to.eql(SCOLAIRE_DATE.getTime());
        });
    });

    describe('date de mise à jour absente', () => {
        it('retourne null pour indicators_updated_at quand updated_at_indicators est null malgré une valeur', () => {
            const result = toFreshnessRow(buildRow({ nombre_personnes: 10, updated_at_indicators: null }));

            expect(result.indicators_updated_at).to.be.null;
        });

        it('retourne null pour scolaire_updated_at quand updated_at_scolaire est null malgré une valeur', () => {
            const result = toFreshnessRow(buildRow({ scolaire_nombre_lycee: 4, updated_at_scolaire: null }));

            expect(result.scolaire_updated_at).to.be.null;
        });
    });

    it('ne modifie pas la ligne source', () => {
        const row = buildRow({ nombre_personnes: 10, scolaire_nombre_lycee: 4 });
        const copy = { ...row };

        toFreshnessRow(row);

        expect(row).to.eql(copy);
    });
});
