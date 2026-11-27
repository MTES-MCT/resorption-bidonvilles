import { expect } from 'chai';

import computeActionFreshness from './computeActionFreshness';
import { FreshnessRow } from './computeIndicatorsFreshness';

/**
 * Contrat testé : `_common/computeActionFreshness.ts`
 *
 *   export default function computeActionFreshness(
 *       startedAt: number | Date, endedAt: number | Date | null, freshnessRows: FreshnessRow[], referenceDate: Date,
 *   ): { isActivePreviousYear: boolean, isUpToDate90Days: boolean, isUpToDate180Days: boolean }
 *
 *   - isActivePreviousYear = isActiveInYear(startedAt, endedAt, referenceDate.getFullYear() - 1) ;
 *   - action inactive : les deux booléens de fraîcheur sont false, même avec une mise à jour récente (exclusion de
 *     l'action entière) ;
 *   - action active : les booléens viennent de computeIndicatorsFreshness(freshnessRows, referenceDate).
 * Les vraies fonctions sont utilisées (pas de double) : ce spec teste l'assemblage.
 */
const DAY = 86_400_000;
const REFERENCE = new Date(2026, 5, 15, 12, 0, 0, 0);
const STARTED_2024 = new Date(2024, 0, 1).getTime();

function ago(days: number, reference: Date = REFERENCE): number {
    return reference.getTime() - days * DAY;
}

describe('models/actionModel/_common/computeActionFreshness()', () => {
    it('est active et à jour pour une action active en N-1 avec un indicateur non scolaire récent sur N-1', () => {
        const rows: FreshnessRow[] = [{ year: 2025, indicators_updated_at: ago(10), scolaire_updated_at: null }];

        expect(computeActionFreshness(STARTED_2024, null, rows, REFERENCE)).to.eql({
            isActivePreviousYear: true,
            isUpToDate90Days: true,
            isUpToDate180Days: true,
        });
    });

    it('est à jour pour une action active en N-1 avec un indicateur scolaire récent sur la ligne N', () => {
        const rows: FreshnessRow[] = [{ year: 2026, indicators_updated_at: null, scolaire_updated_at: ago(5) }];

        expect(computeActionFreshness(STARTED_2024, null, rows, REFERENCE)).to.eql({
            isActivePreviousYear: true,
            isUpToDate90Days: true,
            isUpToDate180Days: true,
        });
    });

    it('est active mais pas à jour sans aucune ligne', () => {
        expect(computeActionFreshness(STARTED_2024, null, [], REFERENCE)).to.eql({
            isActivePreviousYear: true,
            isUpToDate90Days: false,
            isUpToDate180Days: false,
        });
    });

    it('ne compte pas un non scolaire récent sur la ligne N ni un scolaire récent sur la ligne N-1', () => {
        const rows: FreshnessRow[] = [
            { year: 2026, indicators_updated_at: ago(5), scolaire_updated_at: null },
            { year: 2025, indicators_updated_at: null, scolaire_updated_at: ago(5) },
        ];

        expect(computeActionFreshness(STARTED_2024, null, rows, REFERENCE)).to.eql({
            isActivePreviousYear: true,
            isUpToDate90Days: false,
            isUpToDate180Days: false,
        });
    });

    it('exclut l\'action entière si elle a commencé en N, même avec une mise à jour récente', () => {
        const rows: FreshnessRow[] = [{ year: 2026, indicators_updated_at: ago(1), scolaire_updated_at: ago(1) }];

        expect(computeActionFreshness(new Date(2026, 0, 10), null, rows, REFERENCE)).to.eql({
            isActivePreviousYear: false,
            isUpToDate90Days: false,
            isUpToDate180Days: false,
        });
    });

    it('exclut une action terminée avant le 1er janvier N-1, même avec une mise à jour récente', () => {
        const rows: FreshnessRow[] = [{ year: 2025, indicators_updated_at: ago(1), scolaire_updated_at: null }];

        expect(computeActionFreshness(STARTED_2024, new Date(2024, 11, 31, 23, 59, 59, 0), rows, REFERENCE)).to.eql({
            isActivePreviousYear: false,
            isUpToDate90Days: false,
            isUpToDate180Days: false,
        });
    });

    it('garde une action terminée en N-1 ou en N', () => {
        const rows: FreshnessRow[] = [{ year: 2025, indicators_updated_at: ago(1), scolaire_updated_at: null }];

        expect(computeActionFreshness(STARTED_2024, new Date(2025, 5, 1), rows, REFERENCE).isActivePreviousYear).to.be.true;
        expect(computeActionFreshness(STARTED_2024, new Date(2026, 1, 1), rows, REFERENCE).isActivePreviousYear).to.be.true;
    });

    it('traite une date de fin nulle comme une action toujours en cours', () => {
        expect(computeActionFreshness(STARTED_2024, null, [], REFERENCE).isActivePreviousYear).to.be.true;
    });

    describe('bornes de 90 et 180 jours', () => {
        it('est à jour à 90 jours pile, pas à 91 jours', () => {
            const at90: FreshnessRow[] = [{ year: 2025, indicators_updated_at: ago(90), scolaire_updated_at: null }];
            const at91: FreshnessRow[] = [{ year: 2025, indicators_updated_at: ago(91), scolaire_updated_at: null }];

            expect(computeActionFreshness(STARTED_2024, null, at90, REFERENCE)).to.include({ isUpToDate90Days: true, isUpToDate180Days: true });
            expect(computeActionFreshness(STARTED_2024, null, at91, REFERENCE)).to.include({ isUpToDate90Days: false, isUpToDate180Days: true });
        });

        it('est à jour à 180 jours pile, pas à 181 jours', () => {
            const at180: FreshnessRow[] = [{ year: 2025, indicators_updated_at: ago(180), scolaire_updated_at: null }];
            const at181: FreshnessRow[] = [{ year: 2025, indicators_updated_at: ago(181), scolaire_updated_at: null }];

            expect(computeActionFreshness(STARTED_2024, null, at180, REFERENCE)).to.include({ isUpToDate90Days: false, isUpToDate180Days: true });
            expect(computeActionFreshness(STARTED_2024, null, at181, REFERENCE)).to.include({ isUpToDate90Days: false, isUpToDate180Days: false });
        });
    });

    describe('bascule du 1er janvier', () => {
        const before = new Date(2025, 11, 31, 23, 59, 59, 0);
        const after = new Date(2026, 0, 1, 0, 0, 1, 0);

        it('la veille : N = 2025, la ligne 2024 non scolaire compte, la ligne 2025 non scolaire non', () => {
            const rows2024: FreshnessRow[] = [{ year: 2024, indicators_updated_at: ago(30, before), scolaire_updated_at: null }];
            const rows2025: FreshnessRow[] = [{ year: 2025, indicators_updated_at: ago(30, before), scolaire_updated_at: null }];

            expect(computeActionFreshness(STARTED_2024, null, rows2024, before)).to.include({ isActivePreviousYear: true, isUpToDate90Days: true });
            expect(computeActionFreshness(STARTED_2024, null, rows2025, before)).to.include({ isActivePreviousYear: true, isUpToDate90Days: false });
        });

        it('le lendemain : N = 2026, la ligne 2025 non scolaire compte, la ligne 2024 non', () => {
            const rows2024: FreshnessRow[] = [{ year: 2024, indicators_updated_at: ago(30, after), scolaire_updated_at: null }];
            const rows2025: FreshnessRow[] = [{ year: 2025, indicators_updated_at: ago(30, after), scolaire_updated_at: null }];

            expect(computeActionFreshness(STARTED_2024, null, rows2025, after)).to.include({ isActivePreviousYear: true, isUpToDate90Days: true });
            expect(computeActionFreshness(STARTED_2024, null, rows2024, after)).to.include({ isActivePreviousYear: true, isUpToDate90Days: false });
        });

        it('une action commencée en 2025 est exclue la veille de la bascule et incluse le lendemain', () => {
            const rows: FreshnessRow[] = [{ year: 2025, indicators_updated_at: ago(1, after), scolaire_updated_at: null }];
            const started = new Date(2025, 5, 1);

            expect(computeActionFreshness(started, null, rows, before)).to.include({ isActivePreviousYear: false, isUpToDate90Days: false });
            expect(computeActionFreshness(started, null, rows, after)).to.include({ isActivePreviousYear: true, isUpToDate90Days: true });
        });
    });

    describe('types des dates', () => {
        const rows: FreshnessRow[] = [{ year: 2025, indicators_updated_at: ago(10), scolaire_updated_at: null }];
        const expected = { isActivePreviousYear: true, isUpToDate90Days: true, isUpToDate180Days: true };

        it('accepte des nombres (ms) pour le début et la fin', () => {
            expect(computeActionFreshness(STARTED_2024, new Date(2027, 0, 1).getTime(), rows, REFERENCE)).to.eql(expected);
        });

        it('accepte des Date pour le début et la fin', () => {
            expect(computeActionFreshness(new Date(STARTED_2024), new Date(2027, 0, 1), rows, REFERENCE)).to.eql(expected);
        });

        it('donne le même résultat pour Date et nombre', () => {
            const started = new Date(2025, 3, 1);
            const ended = new Date(2025, 8, 1);

            expect(computeActionFreshness(started, ended, rows, REFERENCE))
                .to.eql(computeActionFreshness(started.getTime(), ended.getTime(), rows, REFERENCE));
        });
    });

    it('ne modifie pas les lignes fournies', () => {
        const rows: FreshnessRow[] = [
            { year: 2025, indicators_updated_at: ago(10), scolaire_updated_at: null },
            { year: 2026, indicators_updated_at: null, scolaire_updated_at: ago(200) },
        ];
        const copy = JSON.parse(JSON.stringify(rows));

        computeActionFreshness(STARTED_2024, null, rows, REFERENCE);

        expect(rows).to.eql(copy);
    });
});
