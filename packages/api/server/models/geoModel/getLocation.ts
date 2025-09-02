import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import {
    Location, Nation, Region, Departement, EPCI, City, Metropole, Outremer,
} from './Location.d';
import { LocationType } from './LocationType.d';

const methods = {
    nation: (): Promise<Nation> => Promise.resolve({
        type: 'nation',
        region: null,
        departement: null,
        epci: null,
        city: null,
    }),
    metropole: (): Promise<Metropole> => Promise.resolve({
        type: 'metropole',
        region: null,
        departement: null,
        epci: null,
        city: null,
    }),
    outremer: (): Promise<Outremer> => Promise.resolve({
        type: 'outremer',
        region: null,
        departement: null,
        epci: null,
        city: null,
    }),
    region: async (code: string): Promise<Region> => {
        const [region]: any = await sequelize.query(
            'SELECT name, code FROM regions WHERE code = :code',
            {
                type: QueryTypes.SELECT,
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
    departement: async (code: string): Promise<Departement> => {
        const [departement]: any = await sequelize.query(
            `SELECT
                departements.name AS name,
                departements.code AS code,
                regions.name AS "regionName",
                regions.code AS "regionCode"
            FROM departements
            LEFT JOIN regions ON departements.fk_region = regions.code
            WHERE departements.code = :code`,
            {
                type: QueryTypes.SELECT,
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
    epci: async (code: string): Promise<EPCI> => {
        const [epci]: any = await sequelize.query(
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
                type: QueryTypes.SELECT,
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
    city: async (code: string): Promise<City> => {
        const [city]: any = await sequelize.query(
            `SELECT
                cities.name AS name,
                cities.code AS code,
                cities.fk_main as main,
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
                type: QueryTypes.SELECT,
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
                main: city.main,
            },
        };
    },
};

export default (type: LocationType, code: string): Promise<Location> => methods[type](code);
