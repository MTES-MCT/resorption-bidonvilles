import { sequelize } from '#db/sequelize';

const methods = {
    nation: () => ({
        type: 'nation',
        region: null,
        departement: null,
        epci: null,
        city: null,
    }),
    region: async (code) => {
        const [region] = await sequelize.query(
            'SELECT name, code FROM regions WHERE code = :code',
            {
                type: sequelize.QueryTypes.SELECT,
                replacements: { code },
            },
        );

        if (region === undefined) {
            return null;
        }

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
        const [departement] = await sequelize.query(
            `SELECT
                departements.name AS name,
                departements.code AS code,
                regions.name AS "regionName",
                regions.code AS "regionCode"
            FROM departements
            LEFT JOIN regions ON departements.fk_region = regions.code
            WHERE departements.code = :code`,
            {
                type: sequelize.QueryTypes.SELECT,
                replacements: { code },
            },
        );

        if (departement === undefined) {
            return null;
        }

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
        const [epci] = await sequelize.query(
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
                type: sequelize.QueryTypes.SELECT,
                replacements: { code },
            },
        );

        if (epci === undefined) {
            return null;
        }

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
        const [city] = await sequelize.query(
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
                type: sequelize.QueryTypes.SELECT,
                replacements: { code },
            },
        );

        if (city === undefined) {
            return null;
        }

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

export default (type, code) => methods[type](code);
