import getSince from './getSince';

export default function formatDateSince(date) {
    const { days, years, months } = getSince(date);
    if (years > 0) {
        const yearsText = `${years} an${years > 1 ? 's' : ''}`;
        return months % 12 > 0
            ? `${yearsText} et ${months % 12} mois`
            : yearsText;
    }

    if (months > 0) {
        return `${months} mois`;
    }

    if (days === 1) {
        return 'Hier';
    }

    if (days > 0) {
        return `${days} jours`;
    }

    return "Aujourd'hui";
}
