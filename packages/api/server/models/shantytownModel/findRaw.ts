import { sequelize } from '#db/sequelize';
import { QueryTypes, Transaction } from 'sequelize';
import rawLocation from './_common/rawLocation';

export default async function findRaw(shantytownId: number, transaction: Transaction = undefined) {
    const locationSelection = Object.entries(rawLocation.selection)
        .map(([key, alias]) => `${key} AS "${alias}"`)
        .join(', ');

    const locationJoins = rawLocation.joins
        .map(join => `LEFT JOIN ${join.table} ON ${join.on}`)
        .join(' ');

    const [town, locationRow]: any[] = await Promise.all([
        // On récupère les données brutes du site
        sequelize.query(
            `SELECT shantytowns.*
        FROM shantytowns
        WHERE shantytowns.shantytown_id = :shantytownId`,
            {
                replacements: { shantytownId },
                type: QueryTypes.SELECT,
                transaction,
            },
        ),
        // On récupère les données de localisation pour vérifier les permissions
        sequelize.query(
            `SELECT ${locationSelection}
        FROM shantytowns
        ${locationJoins}
        WHERE shantytowns.shantytown_id = :shantytownId`,
            {
                replacements: { shantytownId },
                type: QueryTypes.SELECT,
                transaction,
            },
        ),
    ]);

    if (town.length !== 1) {
        return null;
    }

    if (locationRow.length !== 1) {
        return null;
    }

    // On construit l'objet de localisation nécessaire à la vérification des permissions
    const location = {
        city: {
            code: locationRow[0].cityCode,
            name: locationRow[0].cityName,
            main: locationRow[0].cityMain,
        },
        epci: {
            code: locationRow[0].epciCode,
            name: locationRow[0].epciName,
        },
        departement: {
            code: locationRow[0].departementCode,
            name: locationRow[0].departementName,
        },
        region: {
            code: locationRow[0].regionCode,
            name: locationRow[0].regionName,
        },
    };

    return { ...town[0], location };
}
