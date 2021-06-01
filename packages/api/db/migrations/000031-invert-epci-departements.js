const parser = require('neat-csv');
const fs = require('fs');
const path = require('path');
const { sequelize } = require('../models');

/**
 * Adds a column fk_departement to cities
 */
function addDepartementColumnToCities(queryInterface, Sequelize) {
    return queryInterface.addColumn(
        'cities',
        'fk_departement',
        {
            type: Sequelize.STRING(3),
            allowNull: true,
        },
    );
}

/**
 * Adds a foreign key to cities.fk_departement
 */
function addDepartementConstraintToCities(queryInterface) {
    return queryInterface.addConstraint('cities', ['fk_departement'], {
        type: 'foreign key',
        name: 'fk_cities_departement',
        references: {
            table: 'departements',
            field: 'code',
        },
        onUpdate: 'cascade',
        onDelete: 'restrict',
    });
}

/**
 * Sets a value for each city's fk_departement
 */
function fillCitiesWithDepartements() {
    return parser(
        fs.readFileSync(path.resolve(__dirname, '..', 'data/cities.csv'), { encoding: 'utf8' }),
        {
            headers: ['code', 'name', 'epciCode', 'epciName', 'departementCode', 'regionCode'],
            separator: ';',
        },
    )
        .then(cities => cities.filter(city => city.epciName !== 'Sans objet'))
        .then(async (cities) => {
            for (let i = 0; i < cities.length; i += 100) {
                /* eslint-disable no-await-in-loop */
                await Promise.all(
                    cities.slice(i, i + 100).map(city => sequelize.query(`UPDATE "cities" SET fk_departement = '${city.departementCode}' WHERE code = '${city.code}'`)),
                );
            }

            return cities;
        })
        .then(() => sequelize.query('UPDATE cities SET fk_departement = main.fk_departement FROM cities AS main WHERE cities.fk_main = main.code;'));
}

/**
 * Makes the column cties.fk_departement not nullable
 */
function makeDepartementsMandatoriesForCities(queryInterface, Sequelize) {
    return queryInterface.changeColumn('cities', 'fk_departement', {
        type: Sequelize.STRING(3),
        allowNull: false,
    });
}

/**
 * Creates a direct relation between cities and departements
 */
function createRelationCitiesToDepartements(queryInterface, Sequelize) {
    return addDepartementColumnToCities(queryInterface, Sequelize)
        .then(addDepartementConstraintToCities.bind(this, queryInterface, Sequelize))
        .then(fillCitiesWithDepartements.bind(this, queryInterface, Sequelize))
        .then(makeDepartementsMandatoriesForCities.bind(this, queryInterface, Sequelize));
}

/**
 * Removes the foreign key on epci.fk_departement
 */
function removeDepartementConstraintFromEpci(queryInterface) {
    return queryInterface.removeConstraint('epci', 'fk_epci_departement');
}

/**
 * Removes the column epci.fk_departement
 */
function removeDepartementColumnFromEpci(queryInterface) {
    return queryInterface.removeColumn('epci', 'fk_departement');
}

/**
 * Removes the relation between epcis and departements
 */
function removeRelationEpciToDepartements(queryInterface, Sequelize) {
    return removeDepartementConstraintFromEpci(queryInterface, Sequelize)
        .then(removeDepartementColumnFromEpci.bind(this, queryInterface, Sequelize));
}

/**
 * Adds a column fk_departement to epci
 */
function addDepartementColumnToEpci(queryInterface, Sequelize) {
    return queryInterface.addColumn(
        'epci',
        'fk_departement',
        {
            type: Sequelize.STRING(3),
            allowNull: true,
        },
    );
}

/**
 * Adds a foreign key to epci.fk_departement
 */
function addDepartementConstraintToEpci(queryInterface) {
    return queryInterface.addConstraint('epci', ['fk_departement'], {
        type: 'foreign key',
        name: 'fk_epci_departement',
        references: {
            table: 'departements',
            field: 'code',
        },
        onUpdate: 'cascade',
        onDelete: 'restrict',
    });
}

/**
 * Creates a direct relation between cities and departements
 */
function createRelationEpciToDepartements(queryInterface, Sequelize) {
    return addDepartementColumnToEpci(queryInterface, Sequelize)
        .then(addDepartementConstraintToEpci.bind(this, queryInterface, Sequelize));
}

/**
 * Removes the foreign key on cities.fk_departement
 */
function removeDepartementConstraintFromCities(queryInterface) {
    return queryInterface.removeConstraint('cities', 'fk_cities_departement');
}

/**
 * Removes the column cities.fk_departement
 */
function removeDepartementColumnFromCities(queryInterface) {
    return queryInterface.removeColumn('cities', 'fk_departement');
}

/**
 * Removes the relation between cities and departements
 */
function removeRelationCitiesToDepartements(queryInterface, Sequelize) {
    return removeDepartementConstraintFromCities(queryInterface, Sequelize)
        .then(removeDepartementColumnFromCities.bind(this, queryInterface, Sequelize));
}

module.exports = {

    up: (queryInterface, Sequelize) => Promise.all([
        createRelationCitiesToDepartements(queryInterface, Sequelize),
        removeRelationEpciToDepartements(queryInterface, Sequelize),
    ])
        .then(() => parser(
            fs.readFileSync(path.join(__dirname, '..', 'data', 'cities.csv'), { encoding: 'utf8' }),
            {
                headers: ['code', 'name', 'epciCode', 'epciName', 'departementCode', 'regionCode'],
                separator: ';',
            },
        ))
        .then(cities => cities.filter(city => city.epciName !== 'Sans objet'))
        .then((cities) => {
            const epci = {};
            cities.forEach((city) => {
                epci[city.epciCode] = {
                    code: city.epciCode,
                    name: city.epciName,
                };
            });

            return queryInterface.bulkInsert('epci', Object.values(epci)).then(() => cities);
        })
        .then(cities => queryInterface.bulkInsert(
            'cities',
            cities.map(city => ({
                code: city.code,
                name: city.name,
                fk_epci: city.epciCode,
                fk_departement: city.departementCode,
            })),
        ))
        .then(() => parser(
            fs.readFileSync(path.join(__dirname, '..', 'data', 'cities_with_districts.csv'), { encoding: 'latin1' }),
            {
                headers: [
                    'ACTUAL',
                    'CHEFLIEU',
                    'CDC',
                    'RANG',
                    'REG',
                    'DEP',
                    'COM',
                    'AR',
                    'CT',
                    'MODIF',
                    'POLE',
                    'TNCC',
                    'ARTMAJ',
                    'NCC',
                    'ARTMIN',
                    'NCCENR',
                    'ARTICLCT',
                    'NCCCT',
                ],
                separator: '	',
            },
        ))
        .then(cities => cities.slice(1).filter(city => city.POLE !== ''))
        .then(async (cities) => {
            const mainCities = await sequelize.query(`
                SELECT
                    code,
                    fk_departement,
                    fk_epci
                FROM cities
                WHERE code IN (:codes)`, {
                type: sequelize.QueryTypes.SELECT,
                replacements: {
                    codes: cities.map(city => city.POLE),
                },
            });

            const data = {
                departements: {},
                epci: {},
            };
            mainCities.forEach((city) => {
                data.departements[city.code] = city.fk_departement;
                data.epci[city.code] = city.fk_epci;
            });
            data.cities = cities.filter(city => data.departements[city.POLE] !== undefined);

            return data;
        })
        .then(data => queryInterface.bulkInsert(
            'cities',
            data.cities.map(city => ({
                code: `${city.DEP}${city.COM}`,
                name: city.NCCENR,
                fk_epci: data.epci[city.POLE],
                fk_departement: data.departements[city.POLE],
                fk_main: city.POLE,
            })),
        )),

    down: (queryInterface, Sequelize) => Promise.all([
        removeRelationCitiesToDepartements(queryInterface, Sequelize),
        createRelationEpciToDepartements(queryInterface, Sequelize),
    ]),
};
