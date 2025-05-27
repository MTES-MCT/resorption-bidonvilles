export default function formatStat(number) {
    return new Intl.NumberFormat("fr-FR", {
        maximumFractionDigits: 0,
        useGrouping: true,
    }).format(number);
}
