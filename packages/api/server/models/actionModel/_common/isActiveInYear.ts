/**
 * Une action est active dans `year` si elle a commencé au plus tard le 31/12/year 23:59:59.999 (heure locale)
 * et si elle n'a pas de date de fin ou se termine au plus tôt le 01/01/year 00:00:00 (heure locale).
 */
export default function isActiveInYear(startedAt: number | string | Date, endedAt: number | string | Date | null, year: number): boolean {
    const startOfYear = new Date(year, 0, 1, 0, 0, 0, 0).getTime();
    const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999).getTime();

    if (new Date(startedAt).getTime() > endOfYear) {
        return false;
    }

    return endedAt === null || new Date(endedAt).getTime() >= startOfYear;
}
