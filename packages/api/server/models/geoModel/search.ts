import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

function generateSearch(table: string) {
    const map = {
        cities: {
            label: 'Commune',
            type: 'city',
        },
        epci: {
            label: 'Intercommunalité',
            type: 'epci',
        },
        departements: {
            label: 'Département',
            type: 'departement',
        },
        regions: {
            label: 'Région',
            type: 'region',
        },
    };

    const departement_map = {
        cities: 'fk_departement',
        epci: 'fk_departement',
        departements: 'code',
        regions: 'null',
    };


    return `
    SELECT
        '${map[table].label}' AS "label",
        '${map[table].type}' AS "type",
        code,
        name,
        ${departement_map[table]} AS "departement"
    FROM
        ${table}
    ${table === 'epci' ? 'LEFT JOIN epci_to_departement ON epci.code = epci_to_departement.fk_epci' : ''}     
    WHERE
        UNACCENT(REPLACE(name, '-', ' ')) ILIKE UNACCENT(REPLACE(?, '-', ' '))
        ${table === 'cities' ? 'AND fk_main IS NULL' : ''}
    ORDER BY
        CASE
            WHEN UNACCENT(REPLACE(name, '-', ' ')) ILIKE UNACCENT(REPLACE(?, '-', ' ')) THEN 1
            ELSE 2
        END,
        name ASC
    LIMIT 4`;
}

export default query => sequelize.query(
    `(${generateSearch('cities')}) UNION (${generateSearch('epci')}) UNION (${generateSearch('departements')}) UNION (${generateSearch('regions')}) ORDER BY "type" DESC`,
    {
        replacements: [
            `%${query}%`,
            `${query}%`,
            `%${query}%`,
            `${query}%`,
            `%${query}%`,
            `${query}%`,
            `%${query}%`,
            `${query}%`,
        ],
        type: QueryTypes.SELECT,
    },
);
