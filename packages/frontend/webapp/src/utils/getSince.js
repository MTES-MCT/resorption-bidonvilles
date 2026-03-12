// Convertit une date en un objet contenant le nombre de jours, semaines, mois et années écoulés depuis cette date
function toDate(input) {
    if (input instanceof Date) {
        return new Date(input);
    }

    if (typeof input === "number" && Number.isFinite(input)) {
        const milliseconds = Math.abs(input) < 1e12 ? input * 1000 : input;
        return new Date(milliseconds);
    }

    return new Date(input);
}

// Calculer la différence en mois civils entre deux dates
function diffInCalendarMonths(fromDate, toDate) {
    const fromYear = fromDate.getUTCFullYear();
    const toYear = toDate.getUTCFullYear();
    const fromMonth = fromDate.getUTCMonth();
    const toMonth = toDate.getUTCMonth();

    let months = (toYear - fromYear) * 12 + (toMonth - fromMonth);

    if (toDate.getUTCDate() < fromDate.getUTCDate()) {
        months -= 1;
    }

    return Math.max(0, months);
}

// Exporte une fonction qui prend une date en entrée et retourne un objet avec le nombre de jours, semaines, mois et années écoulés depuis cette date
export default function getSince(value) {
    const now = new Date();
    const then = toDate(value);

    if (Number.isNaN(then.getTime())) {
        return {
            days: 0,
            weeks: 0,
            months: 0,
            years: 0,
        };
    }

    now.setUTCHours(0, 0, 0, 0);
    then.setUTCHours(0, 0, 0, 0);

    const olderTime = Math.min(then.getTime(), now.getTime());
    const newerTime = Math.max(then.getTime(), now.getTime());
    const days = Math.floor((newerTime - olderTime) / (1000 * 3600 * 24));

    const weeks = Math.floor(days / 7);
    const months = diffInCalendarMonths(
        then.getTime() < now.getTime() ? then : now,
        then.getTime() < now.getTime() ? now : then
    );
    const years = Math.floor(months / 12);

    return {
        days,
        weeks,
        months,
        years,
    };
}
