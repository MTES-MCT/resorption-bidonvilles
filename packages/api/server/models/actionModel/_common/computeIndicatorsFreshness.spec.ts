import { expect } from 'chai';

import computeIndicatorsFreshness from './computeIndicatorsFreshness';

/**
 * Contrat testé : `_common/computeIndicatorsFreshness.ts`
 *
 *   type FreshnessRow = { year: number, indicators_updated_at: number | null, scolaire_updated_at: number | null }
 *   export default function computeIndicatorsFreshness(rows: FreshnessRow[], referenceDate: Date): { isUpToDate90Days: boolean, isUpToDate180Days: boolean }
 *
 * Règle : N = referenceDate.getFullYear(). Une ligne compte si
 *   - year === N - 1 et indicators_updated_at (non scolaire) est non nul et récent ; OU
 *   - year === N     et scolaire_updated_at (scolaire) est non nul et récent.
 * « Récent » pour un seuil S : (referenceDate - date) <= S * 86 400 000 ms (borne incluse).
 * Les dates sont en ms ; `null` = nature sans valeur sur la ligne, ignorée.
 * Choix : une date postérieure à la date de référence (âge négatif) est considérée récente (âge <= S).
 */
const DAY = 86_400_000;
const REFERENCE = new Date(2026, 5, 15, 12, 0, 0, 0);

function ago(days: number, extraMs = 0, from: Date = REFERENCE): number {
    return from.getTime() - days * DAY - extraMs;
}

function row(year: number, indicators: number | null, scolaire: number | null = null) {
    return { year, indicators_updated_at: indicators, scolaire_updated_at: scolaire };
}

describe('models/actionModel/_common/computeIndicatorsFreshness()', () => {
    describe('nature et année', () => {
        it('est à jour quand un indicateur non scolaire de la ligne N-1 est récent', () => {
            expect(computeIndicatorsFreshness([row(2025, ago(10))], REFERENCE)).to.eql({
                isUpToDate90Days: true,
                isUpToDate180Days: true,
            });
        });

        it('n\'est pas à jour quand l\'indicateur non scolaire récent est sur la ligne N seulement', () => {
            expect(computeIndicatorsFreshness([row(2026, ago(10))], REFERENCE)).to.eql({
                isUpToDate90Days: false,
                isUpToDate180Days: false,
            });
        });

        it('est à jour quand un indicateur scolaire de la ligne N est récent', () => {
            expect(computeIndicatorsFreshness([row(2026, null, ago(10))], REFERENCE)).to.eql({
                isUpToDate90Days: true,
                isUpToDate180Days: true,
            });
        });

        it('n\'est pas à jour quand l\'indicateur scolaire récent est sur la ligne N-1 seulement', () => {
            expect(computeIndicatorsFreshness([row(2025, null, ago(10))], REFERENCE)).to.eql({
                isUpToDate90Days: false,
                isUpToDate180Days: false,
            });
        });

        it('ignore une ligne d\'une année plus ancienne que N-1', () => {
            expect(computeIndicatorsFreshness([row(2024, ago(10), ago(10))], REFERENCE)).to.eql({
                isUpToDate90Days: false,
                isUpToDate180Days: false,
            });
        });

        it('ignore une ligne d\'une année postérieure à N', () => {
            expect(computeIndicatorsFreshness([row(2027, ago(10), ago(10))], REFERENCE)).to.eql({
                isUpToDate90Days: false,
                isUpToDate180Days: false,
            });
        });

        it('ignore une nature à null même si l\'autre est récente', () => {
            expect(computeIndicatorsFreshness([row(2025, null, ago(1)), row(2026, ago(1), null)], REFERENCE)).to.eql({
                isUpToDate90Days: false,
                isUpToDate180Days: false,
            });
        });
    });

    describe('bornes des seuils', () => {
        it('90 jours pile : à jour à 90 et à 180 jours (borne incluse)', () => {
            expect(computeIndicatorsFreshness([row(2025, ago(90))], REFERENCE)).to.eql({
                isUpToDate90Days: true,
                isUpToDate180Days: true,
            });
        });

        it('90 jours + 1 ms : plus à jour à 90 jours, encore à 180 jours', () => {
            expect(computeIndicatorsFreshness([row(2025, ago(90, 1))], REFERENCE)).to.eql({
                isUpToDate90Days: false,
                isUpToDate180Days: true,
            });
        });

        it('90 jours - 1 ms : à jour à 90 jours', () => {
            expect(computeIndicatorsFreshness([row(2025, ago(90, -1))], REFERENCE).isUpToDate90Days).to.equal(true);
        });

        it('100 jours : faux à 90 jours, vrai à 180 jours', () => {
            expect(computeIndicatorsFreshness([row(2025, ago(100))], REFERENCE)).to.eql({
                isUpToDate90Days: false,
                isUpToDate180Days: true,
            });
        });

        it('180 jours pile : à jour à 180 jours (borne incluse)', () => {
            expect(computeIndicatorsFreshness([row(2025, ago(180))], REFERENCE)).to.eql({
                isUpToDate90Days: false,
                isUpToDate180Days: true,
            });
        });

        it('180 jours + 1 ms : faux aux deux seuils', () => {
            expect(computeIndicatorsFreshness([row(2025, ago(180, 1))], REFERENCE)).to.eql({
                isUpToDate90Days: false,
                isUpToDate180Days: false,
            });
        });

        it('applique les mêmes bornes à la nature scolaire de la ligne N', () => {
            expect(computeIndicatorsFreshness([row(2026, null, ago(90))], REFERENCE).isUpToDate90Days).to.equal(true);
            expect(computeIndicatorsFreshness([row(2026, null, ago(90, 1))], REFERENCE).isUpToDate90Days).to.equal(false);
            expect(computeIndicatorsFreshness([row(2026, null, ago(180))], REFERENCE).isUpToDate180Days).to.equal(true);
            expect(computeIndicatorsFreshness([row(2026, null, ago(180, 1))], REFERENCE).isUpToDate180Days).to.equal(false);
        });

        it('compte en millisecondes et non en mois civils (mars-juin = 106 jours)', () => {
            const reference = new Date(2026, 5, 30, 12, 0, 0, 0);
            const updatedAt = new Date(2026, 2, 16, 12, 0, 0, 0).getTime();

            expect(computeIndicatorsFreshness([row(2025, updatedAt)], reference)).to.eql({
                isUpToDate90Days: false,
                isUpToDate180Days: true,
            });
        });
    });

    describe('bascule du 1er janvier', () => {
        const lastInstant = new Date(2026, 11, 31, 23, 59, 0, 0);
        const firstInstant = new Date(2027, 0, 1, 0, 0, 0, 0);

        it('le 31/12/2026 23:59, la ligne 2025 non scolaire compte (N = 2026)', () => {
            expect(computeIndicatorsFreshness([row(2025, ago(5, 0, lastInstant))], lastInstant).isUpToDate90Days).to.equal(true);
        });

        it('le 01/01/2027 00:00, la même ligne 2025 ne compte plus (N = 2027)', () => {
            expect(computeIndicatorsFreshness([row(2025, ago(5, 0, lastInstant))], firstInstant)).to.eql({
                isUpToDate90Days: false,
                isUpToDate180Days: false,
            });
        });

        it('le 01/01/2027 00:00, la ligne 2026 non scolaire compte', () => {
            expect(computeIndicatorsFreshness([row(2026, ago(5, 0, lastInstant))], firstInstant).isUpToDate90Days).to.equal(true);
            expect(computeIndicatorsFreshness([row(2026, ago(5, 0, lastInstant))], lastInstant).isUpToDate90Days).to.equal(false);
        });

        it('la ligne scolaire 2026 compte jusqu\'au 31/12/2026 puis plus au 01/01/2027', () => {
            const updatedAt = ago(5, 0, lastInstant);

            expect(computeIndicatorsFreshness([row(2026, null, updatedAt)], lastInstant).isUpToDate90Days).to.equal(true);
            expect(computeIndicatorsFreshness([row(2026, null, updatedAt)], firstInstant).isUpToDate90Days).to.equal(false);
        });
    });

    describe('cas généraux', () => {
        it('retourne deux faux quand il n\'y a aucune ligne', () => {
            expect(computeIndicatorsFreshness([], REFERENCE)).to.eql({
                isUpToDate90Days: false,
                isUpToDate180Days: false,
            });
        });

        it('plusieurs lignes : la plus récente pertinente décide', () => {
            const rows = [
                row(2024, ago(1), ago(1)), // non pertinente (année)
                row(2025, ago(150)), // pertinente, 150 jours
                row(2025, ago(30)), // pertinente, 30 jours
                row(2026, ago(2)), // non pertinente (non scolaire sur N)
            ];

            expect(computeIndicatorsFreshness(rows, REFERENCE)).to.eql({
                isUpToDate90Days: true,
                isUpToDate180Days: true,
            });
        });

        it('plusieurs lignes : seule une ligne ancienne est pertinente, la récente ne l\'est pas', () => {
            const rows = [row(2025, ago(120)), row(2026, ago(1)), row(2025, null, ago(1))];

            expect(computeIndicatorsFreshness(rows, REFERENCE)).to.eql({
                isUpToDate90Days: false,
                isUpToDate180Days: true,
            });
        });

        it('combine les deux natures : le scolaire de N peut suffire quand le non scolaire de N-1 est ancien', () => {
            const rows = [row(2025, ago(200)), row(2026, null, ago(20))];

            expect(computeIndicatorsFreshness(rows, REFERENCE)).to.eql({
                isUpToDate90Days: true,
                isUpToDate180Days: true,
            });
        });

        it('ne modifie pas les lignes reçues', () => {
            const rows = [row(2025, ago(10))];
            const copy = JSON.parse(JSON.stringify(rows));

            computeIndicatorsFreshness(rows, REFERENCE);

            expect(rows).to.eql(copy);
        });
    });
});
