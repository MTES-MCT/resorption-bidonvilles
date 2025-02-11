import departementsOrdonnes from '#server/utils/departementsOrdonnes';

// On limite le risque d'injection de code en créant une whitelist des valeurs possibles
// pour le schéma, limitée aux cinq dernières années et à l'année à venir
export function getAllowedSchemas(currentYear: number) {
    return [
        `ff${currentYear - 4}_dep`,
        `ff${currentYear - 3}_dep`,
        `ff${currentYear - 2}_dep`,
        `ff${currentYear - 1}_dep`,
        `ff${currentYear}_dep`,
        `ff${currentYear + 1}_dep`];
}

export function getAllowedTables(currentYear: number, dept: string, tableName: string) {
    const departements = Array.from(departementsOrdonnes.keys());
    const years = [
        currentYear - 4,
        currentYear - 3,
        currentYear - 2,
        currentYear - 1,
        currentYear,
        currentYear + 1,
    ];
    return departements.includes(dept)
        ? years.map(year => `d${dept}_fftp_${year}_${tableName}`)
        : [];
}
