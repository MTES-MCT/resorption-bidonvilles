import { expect } from 'chai';

import applyIndicatorsFreshness from './applyIndicatorsFreshness';
import { ActionHash } from './hashActions';

/**
 * Contrat testé : `fetch/applyIndicatorsFreshness.ts`
 *
 *   export default function applyIndicatorsFreshness(hash: ActionHash, referenceDate: Date): void
 *
 * Pour CHAQUE action du hash, pose (par mutation) :
 *   - is_active_previous_year    : isActiveInYear(started_at, ended_at, N - 1) ;
 *   - indicators_up_to_date_90d  : computeIndicatorsFreshness(action.metrics, referenceDate).isUpToDate90Days ;
 *   - indicators_up_to_date_180d : idem pour 180 jours ;
 * avec N = referenceDate.getFullYear().
 * Choix : started_at / ended_at sont des nombres en ms (cf. hashActions.ts). Chaque entrée de action.metrics porte
 * `year`, `indicators_updated_at` et `scolaire_updated_at` (ms ou null). Une action inactive en N-1 a les deux
 * booléens `indicators_up_to_date_*` à false, même avec une mise à jour récente (exclusion de l'action entière).
 * Les calculs sont faits sur les vraies fonctions (pas de double), ce qui valide aussi le câblage.
 */
const DAY = 86_400_000;
const REFERENCE = new Date(2026, 5, 15, 12, 0, 0, 0);

type MetricInput = { year: number, indicators_updated_at: number | null, scolaire_updated_at: number | null };

function ago(days: number): number {
    return REFERENCE.getTime() - days * DAY;
}

function buildAction(
    id: number,
    options: { startedAt?: number, endedAt?: number | null, metrics?: MetricInput[] } = {},
): ActionHash[number] {
    return {
        id,
        started_at: options.startedAt ?? new Date(2024, 0, 1).getTime(),
        ended_at: options.endedAt ?? null,
        metrics: options.metrics ?? [],
    } as unknown as ActionHash[number];
}

function buildHash(...actions: ActionHash[number][]): ActionHash {
    return actions.reduce((acc, action) => {
        acc[action.id] = action;
        return acc;
    }, {} as ActionHash);
}

type Flags = { is_active_previous_year: boolean, indicators_up_to_date_90d: boolean, indicators_up_to_date_180d: boolean };

function flagsOf(action: ActionHash[number]): Flags {
    const { is_active_previous_year: active, indicators_up_to_date_90d: d90, indicators_up_to_date_180d: d180 } = action as unknown as Flags;
    return { is_active_previous_year: active, indicators_up_to_date_90d: d90, indicators_up_to_date_180d: d180 };
}

describe('models/actionModel/fetch/applyIndicatorsFreshness()', () => {
    it('pose les trois drapeaux à true pour une action active en N-1 avec un indicateur non scolaire récent sur N-1', () => {
        const hash = buildHash(buildAction(1, { metrics: [{ year: 2025, indicators_updated_at: ago(10), scolaire_updated_at: null }] }));

        applyIndicatorsFreshness(hash, REFERENCE);

        expect(flagsOf(hash[1])).to.eql({
            is_active_previous_year: true,
            indicators_up_to_date_90d: true,
            indicators_up_to_date_180d: true,
        });
    });

    it('distingue les seuils 90 et 180 jours (mise à jour il y a 100 jours)', () => {
        const hash = buildHash(buildAction(1, { metrics: [{ year: 2025, indicators_updated_at: ago(100), scolaire_updated_at: null }] }));

        applyIndicatorsFreshness(hash, REFERENCE);

        expect(flagsOf(hash[1])).to.eql({
            is_active_previous_year: true,
            indicators_up_to_date_90d: false,
            indicators_up_to_date_180d: true,
        });
    });

    it('prend en compte un indicateur scolaire récent sur la ligne N', () => {
        const hash = buildHash(buildAction(1, { metrics: [{ year: 2026, indicators_updated_at: null, scolaire_updated_at: ago(5) }] }));

        applyIndicatorsFreshness(hash, REFERENCE);

        expect(flagsOf(hash[1]).indicators_up_to_date_90d).to.equal(true);
        expect(flagsOf(hash[1]).indicators_up_to_date_180d).to.equal(true);
    });

    it('ne compte pas un non scolaire récent sur la ligne N seulement', () => {
        const hash = buildHash(buildAction(1, { metrics: [{ year: 2026, indicators_updated_at: ago(5), scolaire_updated_at: null }] }));

        applyIndicatorsFreshness(hash, REFERENCE);

        expect(flagsOf(hash[1])).to.eql({
            is_active_previous_year: true,
            indicators_up_to_date_90d: false,
            indicators_up_to_date_180d: false,
        });
    });

    it('traite une action sans métrique : active en N-1 mais pas à jour', () => {
        const hash = buildHash(buildAction(1, { metrics: [] }));

        applyIndicatorsFreshness(hash, REFERENCE);

        expect(flagsOf(hash[1])).to.eql({
            is_active_previous_year: true,
            indicators_up_to_date_90d: false,
            indicators_up_to_date_180d: false,
        });
    });

    it('exclut l\'action entière quand elle est inactive en N-1, même avec une mise à jour récente', () => {
        const hash = buildHash(buildAction(1, {
            startedAt: new Date(2026, 2, 1).getTime(),
            metrics: [
                { year: 2025, indicators_updated_at: ago(5), scolaire_updated_at: null },
                { year: 2026, indicators_updated_at: null, scolaire_updated_at: ago(5) },
            ],
        }));

        applyIndicatorsFreshness(hash, REFERENCE);

        expect(flagsOf(hash[1])).to.eql({
            is_active_previous_year: false,
            indicators_up_to_date_90d: false,
            indicators_up_to_date_180d: false,
        });
    });

    it('exclut aussi une action terminée avant le 01/01 de N-1', () => {
        const hash = buildHash(buildAction(1, {
            startedAt: new Date(2020, 0, 1).getTime(),
            endedAt: new Date(2024, 11, 31, 23, 59, 59).getTime(),
            metrics: [{ year: 2025, indicators_updated_at: ago(5), scolaire_updated_at: null }],
        }));

        applyIndicatorsFreshness(hash, REFERENCE);

        expect(flagsOf(hash[1])).to.eql({
            is_active_previous_year: false,
            indicators_up_to_date_90d: false,
            indicators_up_to_date_180d: false,
        });
    });

    it('traite chaque action du hash indépendamment', () => {
        const hash = buildHash(
            buildAction(1, { metrics: [{ year: 2025, indicators_updated_at: ago(10), scolaire_updated_at: null }] }),
            buildAction(2, { metrics: [{ year: 2025, indicators_updated_at: ago(150), scolaire_updated_at: null }] }),
            buildAction(3),
            buildAction(4, { startedAt: new Date(2027, 0, 1).getTime() }),
        );

        applyIndicatorsFreshness(hash, REFERENCE);

        expect(flagsOf(hash[1])).to.eql({ is_active_previous_year: true, indicators_up_to_date_90d: true, indicators_up_to_date_180d: true });
        expect(flagsOf(hash[2])).to.eql({ is_active_previous_year: true, indicators_up_to_date_90d: false, indicators_up_to_date_180d: true });
        expect(flagsOf(hash[3])).to.eql({ is_active_previous_year: true, indicators_up_to_date_90d: false, indicators_up_to_date_180d: false });
        expect(flagsOf(hash[4])).to.eql({ is_active_previous_year: false, indicators_up_to_date_90d: false, indicators_up_to_date_180d: false });
    });

    it('suit la date de référence : N-1 change au 1er janvier', () => {
        const metrics = [{ year: 2025, indicators_updated_at: new Date(2026, 11, 20).getTime(), scolaire_updated_at: null }];
        const before = buildHash(buildAction(1, { metrics }));
        const after = buildHash(buildAction(1, { metrics, endedAt: new Date(2025, 5, 1).getTime() }));

        applyIndicatorsFreshness(before, new Date(2026, 11, 31, 23, 59));
        applyIndicatorsFreshness(after, new Date(2027, 0, 1, 0, 0));

        expect(flagsOf(before[1]).indicators_up_to_date_90d).to.equal(true);
        // en 2027, N-1 = 2026 : l'action terminée en 2025 est inactive et la ligne 2025 ne compte plus
        expect(flagsOf(after[1])).to.eql({ is_active_previous_year: false, indicators_up_to_date_90d: false, indicators_up_to_date_180d: false });
    });

    it('ne retourne rien (mutation du hash) et laisse un hash vide intact', () => {
        const hash: ActionHash = {};

        expect(applyIndicatorsFreshness(hash, REFERENCE)).to.be.undefined;
        expect(hash).to.eql({});
    });
});
