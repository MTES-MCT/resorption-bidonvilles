const parser = require('neat-csv');
const fs = require('fs');
const path = require('path');

module.exports = {

    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        // create temporary tables cities_2022 and epci_2022
        await Promise.all([
            queryInterface.createTable(
                'cities_2022',
                {
                    code: {
                        type: Sequelize.STRING(5),
                        allowNull: false,
                    },
                    name: {
                        type: Sequelize.STRING,
                        allowNull: false,
                    },
                    fk_epci: {
                        type: Sequelize.STRING,
                        allowNull: false,
                    },
                    fk_departement: {
                        type: Sequelize.STRING,
                        allowNull: false,
                    },
                },
                { transaction },
            ),
            queryInterface.createTable(
                'epci_2022',
                {
                    code: {
                        type: Sequelize.STRING(9),
                        allowNull: false,
                    },
                    name: {
                        type: Sequelize.STRING,
                        allowNull: false,
                    },
                },
                { transaction },
            ),
        ]);

        // parse new cities and epci data
        const [cities, epcis] = await Promise.all([
            parser(
                fs.readFileSync(path.join(__dirname, '..', 'data', 'cities_2022.csv'), { encoding: 'utf8' }),
                {
                    headers: ['code', 'name', 'departementCode', 'regionCode', 'epciCode', 'arr', 'canton',
                    ],
                    separator: ';',
                },
            ),
            parser(
                fs.readFileSync(path.join(__dirname, '..', 'data', 'epci_2022.csv'), { encoding: 'utf8' }),
                {
                    headers: ['code', 'label',
                    ],
                    separator: ';',
                },
            ),
        ]);

        // fill cities_2022 and epci_2022
        await Promise.all([
            queryInterface.bulkInsert(
                'cities_2022',
                cities.map(city => ({
                    code: city.code.length === 5 ? city.code : `0${city.code}`,
                    name: city.name,
                    fk_epci: city.epciCode,
                    fk_departement: city.departementCode,
                })),
                { transaction },
            ),
            queryInterface.bulkInsert(
                'epci_2022',
                epcis.map(epci => ({
                    code: epci.code,
                    name: epci.label,
                })),
                { transaction },
            ),
        ]);

        // epci updates
        await Promise.all([
            // insert new epci
            queryInterface.sequelize.query(
                `INSERT INTO epci (code, name)
                SELECT code, name
                FROM epci_2022
                WHERE code NOT IN (SELECT code FROM epci)
                `,
                {
                    type: queryInterface.sequelize.QueryTypes.INSERT,
                    transaction,
                },
            ),
            // update existing epci that changed name
            queryInterface.sequelize.query(
                'UPDATE epci SET name = epci_2022.name FROM epci_2022 WHERE epci_2022.code = epci.code AND epci_2022.name != epci.name',
                {
                    type: queryInterface.sequelize.QueryTypes.UPDATE,
                    transaction,
                },
            ),
        ]);

        // city updates
        await Promise.all([
            // insert new cities
            queryInterface.sequelize.query(
                `INSERT INTO cities (code, name, fk_epci, fk_departement)
                SELECT code, name, fk_epci, fk_departement
                FROM cities_2022
                WHERE code NOT IN (SELECT code FROM cities)
                `,
                {
                    type: queryInterface.sequelize.QueryTypes.INSERT,
                    transaction,
                },
            ),
            // update existing cities that changed name
            queryInterface.sequelize.query(
                'UPDATE cities SET name = cities_2022.name FROM cities_2022 WHERE cities_2022.code = cities.code AND cities_2022.name != cities.name',
                {
                    type: queryInterface.sequelize.QueryTypes.UPDATE,
                    transaction,
                },
            ),
            // update existing cities that changed of epci
            queryInterface.sequelize.query(
                `UPDATE cities
                SET fk_epci = epci.code
                FROM cities_2022
                LEFT JOIN epci ON cities_2022.fk_epci = epci.code
                WHERE cities_2022.code = cities.code AND cities_2022.fk_epci != cities.fk_epci`,
                {
                    type: queryInterface.sequelize.QueryTypes.UPDATE,
                    transaction,
                },
            ),
        ]);

        // create organizations for the new EPCI and cities
        await Promise.all([
            queryInterface.sequelize.query(
                `WITH constant(type) AS (SELECT organization_type_id FROM organization_types WHERE name_singular = 'Commune')
                INSERT INTO organizations (name, active, fk_type, fk_city, being_funded)
                SELECT cities.name, false, constant.type, cities.code, false
                FROM cities
                LEFT JOIN organizations ON organizations.fk_city = cities.code
                LEFT JOIN constant on true
                WHERE organizations.fk_city IS null`,
                {
                    type: queryInterface.sequelize.QueryTypes.INSERT,
                    transaction,
                },
            ),
            queryInterface.sequelize.query(
                `WITH constant(type) AS (SELECT organization_type_id FROM organization_types WHERE name_singular = 'Intercommunalité')
                INSERT INTO organizations (name, active, fk_type, fk_epci, being_funded)
                SELECT epci.name, false, constant.type, epci.code, false
                FROM epci
                LEFT JOIN organizations ON organizations.fk_epci = epci.code
                LEFT JOIN constant on true
                WHERE organizations.fk_epci IS null`,
                {
                    type: queryInterface.sequelize.QueryTypes.INSERT,
                    transaction,
                },
            ),
        ]);

        await queryInterface.sequelize.query(
            'REFRESH MATERIALIZED VIEW localized_organizations',
            { transaction },
        );

        return transaction.commit();
    },

    down: () => Promise.resolve(),
};
