export default function formatStat(number) {
    return new Intl.NumberFormat("fr-FR").format(number);
}
