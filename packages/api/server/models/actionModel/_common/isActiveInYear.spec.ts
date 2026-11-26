import { expect } from 'chai';

import isActiveInYear from './isActiveInYear';

/**
 * Contrat testé : `_common/isActiveInYear.ts`
 *
 *   export default function isActiveInYear(startedAt: number | Date, endedAt: number | Date | null, year: number): boolean
 *
 * Choix : `started_at` / `ended_at` sont des nombres (ms) dans ActionHash (cf. hashActions.ts) ; on accepte aussi
 * un objet Date. Une action est active dans `year` si started_at <= 31/12/year 23:59:59.999 (heure locale) et
 * (ended_at nul ou ended_at >= 01/01/year 00:00:00 heure locale).
 */
function at(year: number, month: number, day: number, hours = 0, minutes = 0, seconds = 0, ms = 0): number {
    return new Date(year, month - 1, day, hours, minutes, seconds, ms).getTime();
}

describe('models/actionModel/_common/isActiveInYear()', () => {
    it('est active quand elle a commencé et se poursuit sans date de fin', () => {
        expect(isActiveInYear(at(2023, 3, 1), null, 2025)).to.equal(true);
    });

    it('est active quand elle commence le 31/12 de l\'année (dernière milliseconde incluse)', () => {
        expect(isActiveInYear(at(2025, 12, 31, 23, 59, 59, 999), null, 2025)).to.equal(true);
        expect(isActiveInYear(at(2025, 12, 31), null, 2025)).to.equal(true);
    });

    it('est inactive quand elle commence le 01/01 de l\'année suivante', () => {
        expect(isActiveInYear(at(2026, 1, 1, 0, 0, 0, 0), null, 2025)).to.equal(false);
    });

    it('est inactive quand elle commence bien après l\'année', () => {
        expect(isActiveInYear(at(2027, 6, 1), null, 2025)).to.equal(false);
    });

    it('est active quand elle se termine le 01/01 de l\'année à 00:00:00', () => {
        expect(isActiveInYear(at(2020, 1, 1), at(2025, 1, 1, 0, 0, 0, 0), 2025)).to.equal(true);
    });

    it('est inactive quand elle se termine le 31/12 de l\'année précédente à 23:59:59', () => {
        expect(isActiveInYear(at(2020, 1, 1), at(2024, 12, 31, 23, 59, 59, 0), 2025)).to.equal(false);
    });

    it('est active quand elle se termine à la fin de l\'année ou après', () => {
        expect(isActiveInYear(at(2020, 1, 1), at(2025, 12, 31), 2025)).to.equal(true);
        expect(isActiveInYear(at(2020, 1, 1), at(2030, 1, 1), 2025)).to.equal(true);
    });

    it('est active sur chacune des années d\'une action pluriannuelle', () => {
        const start = at(2022, 5, 10);
        const end = at(2025, 2, 20);

        expect(isActiveInYear(start, end, 2021)).to.equal(false);
        expect(isActiveInYear(start, end, 2022)).to.equal(true);
        expect(isActiveInYear(start, end, 2023)).to.equal(true);
        expect(isActiveInYear(start, end, 2024)).to.equal(true);
        expect(isActiveInYear(start, end, 2025)).to.equal(true);
        expect(isActiveInYear(start, end, 2026)).to.equal(false);
    });

    it('gère une action d\'un seul jour : active uniquement dans l\'année de ce jour', () => {
        const day = at(2025, 7, 14);

        expect(isActiveInYear(day, day, 2024)).to.equal(false);
        expect(isActiveInYear(day, day, 2025)).to.equal(true);
        expect(isActiveInYear(day, day, 2026)).to.equal(false);
    });

    it('accepte des objets Date en plus des nombres', () => {
        expect(isActiveInYear(new Date(2025, 11, 31), null, 2025)).to.equal(true);
        expect(isActiveInYear(new Date(2026, 0, 1), null, 2025)).to.equal(false);
        expect(isActiveInYear(new Date(2020, 0, 1), new Date(2024, 11, 31), 2025)).to.equal(false);
    });
});
