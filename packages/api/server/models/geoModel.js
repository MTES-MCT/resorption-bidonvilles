function generateSearch(table) {
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
        REPLACE(REPLACE(name, '-', ' '), 'Î', 'I') ILIKE REPLACE(?, '-', ' ')
        ${table === 'cities' ? 'AND fk_main IS NULL' : ''}
    ORDER BY
        CASE
            WHEN REPLACE(name, '-', ' ') ILIKE REPLACE(?, '-', ' ') THEN 1
            ELSE 2
        END,
        name ASC
    LIMIT 4`;
}

module.exports = (database) => {
    const methods = {
        nation: () => ({
            type: 'nation',
            region: null,
            departement: null,
            epci: null,
            city: null,
        }),
        region: async (code) => {
            const [region] = await database.query(
                'SELECT name, code FROM regions WHERE code = :code',
                {
                    type: database.QueryTypes.SELECT,
                    replacements: { code },
                },
            );

            return {
                type: 'region',
                region: {
                    name: region.name,
                    code: region.code,
                },
                departement: null,
                epci: null,
                city: null,
            };
        },
        departement: async (code) => {
            const [departement] = await database.query(
                `SELECT
                    departements.name AS name,
                    departements.code AS code,
                    regions.name AS "regionName",
                    regions.code AS "regionCode"
                FROM departements
                LEFT JOIN regions ON departements.fk_region = regions.code
                WHERE departements.code = :code`,
                {
                    type: database.QueryTypes.SELECT,
                    replacements: { code },
                },
            );

            return {
                type: 'departement',
                region: {
                    name: departement.regionName,
                    code: departement.regionCode,
                },
                departement: {
                    name: departement.name,
                    code: departement.code,
                },
                epci: null,
                city: null,
            };
        },
        epci: async (code) => {
            const [epci] = await database.query(
                `SELECT
                    epci.name AS name,
                    epci.code AS code,
                    departements.name AS "departementName",
                    departements.code AS "departementCode",
                    regions.name AS "regionName",
                    regions.code AS "regionCode"
                FROM epci
                LEFT JOIN epci_to_departement ON epci_to_departement.fk_epci = epci.code
                LEFT JOIN departements ON epci_to_departement.fk_departement = departements.code
                LEFT JOIN regions ON departements.fk_region = regions.code
                WHERE epci.code = :code`,
                {
                    type: database.QueryTypes.SELECT,
                    replacements: { code },
                },
            );

            return {
                type: 'epci',
                region: {
                    name: epci.regionName,
                    code: epci.regionCode,
                },
                departement: {
                    name: epci.departementName,
                    code: epci.departementCode,
                },
                epci: {
                    name: epci.name,
                    code: epci.code,
                },
                city: null,
            };
        },
        city: async (code) => {
            const [city] = await database.query(
                `SELECT
                    cities.name AS name,
                    cities.code AS code,
                    epci.name AS "epciName",
                    epci.code AS "epciCode",
                    departements.name AS "departementName",
                    departements.code AS "departementCode",
                    regions.name AS "regionName",
                    regions.code AS "regionCode"
                FROM cities
                LEFT JOIN departements ON cities.fk_departement = departements.code
                LEFT JOIN epci ON cities.fk_epci = epci.code
                LEFT JOIN regions ON departements.fk_region = regions.code
                WHERE cities.code = :code`,
                {
                    type: database.QueryTypes.SELECT,
                    replacements: { code },
                },
            );

            return {
                type: 'city',
                region: {
                    name: city.regionName,
                    code: city.regionCode,
                },
                departement: {
                    name: city.departementName,
                    code: city.departementCode,
                },
                epci: {
                    name: city.epciName,
                    code: city.epciCode,
                },
                city: {
                    name: city.name,
                    code: city.code,
                },
            };
        },
    };

    return {
        getLocation: (type, code) => methods[type](code),
        search: query => database.query(
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
                type: database.QueryTypes.SELECT,
            },
        ),

        /**
         *
         * @param {'region','epci'} locationType
         * @param {*}               locationCode
         */
        getDepartementsFor(locationType, locationCode) {
            return database.query(
                `SELECT
                    departements.code,
                    departements.name
                FROM cities
                LEFT JOIN departements ON cities.fk_departement = departements.code
                WHERE fk_${locationType} = :locationCode
                GROUP BY departements.code, departements.name
                ORDER BY departements.code ASC`,
                {
                    type: database.QueryTypes.SELECT,
                    replacements: {
                        locationCode,
                    },
                },
            );
        },
    };
};
