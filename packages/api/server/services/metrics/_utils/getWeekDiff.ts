
export default (startDate: Date, endDate: Date): number => {
    // Convertir les dates en millisecondes
    const startMillis = startDate.getTime();
    const endMillis = endDate.getTime();

    // Calculer la différence en millisecondes
    const diffMillis = Math.abs(endMillis - startMillis);

    // Calculer le nombre de semaines
    const millisecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
    const weeks = Math.floor(diffMillis / millisecondsPerWeek);

    return weeks;
};
