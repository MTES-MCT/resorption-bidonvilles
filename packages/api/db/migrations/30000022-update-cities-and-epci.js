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
                    created_at: {
                        type: Sequelize.DATE,
                        allowNull: false,
                        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                    },
                    updated_at: {
                        type: Sequelize.DATE,
                        allowNull: false,
                        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
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
                    created_at: {
                        type: Sequelize.DATE,
                        allowNull: false,
                        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                    },
                    updated_at: {
                        type: Sequelize.DATE,
                        allowNull: false,
                        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
                    },
                },
                { transaction },
            ),
            queryInterface.createTable(
                'mov_epci_2022',
                {
                    old_code: {
                        type: Sequelize.STRING(9),
                        allowNull: false,
                    },
                    new_code: {
                        type: Sequelize.STRING,
                        allowNull: false,
                    },
                },
                { transaction },
            ),
        ])
        // fill cities_2022
            .then(() => parser(
                fs.readFileSync(path.join(__dirname, '..', 'data', 'cities_2022.csv'), { encoding: 'utf8' }),
                {
                    headers: ['code', 'name', 'departementCode', 'regionCode', 'epciCode', 'arr', 'canton',
                    ],
                    separator: ';',
                },
            ))
            .then(cities => cities.filter(city => city.COMPARENT === '' || city.COMPARENT !== city.code))
            .then(cities => queryInterface.bulkInsert(
                'cities_2022',
                cities.map(city => ({
                    code: city.code.length === 5 ? city.code : `0${city.code}`,
                    name: city.name,
                    fk_epci: city.epciCode,
                    fk_departement: city.departementCode,
                })),
                { transaction },
            ))
        // fill epci_2022
            .then(() => parser(
                fs.readFileSync(path.join(__dirname, '..', 'data', 'epci_2022.csv'), { encoding: 'utf8' }),
                {
                    headers: ['code', 'label',
                    ],
                    separator: ';',
                },
            ))
            .then(epcis => queryInterface.bulkInsert(
                'epci_2022',
                epcis.map(epci => ({
                    code: epci.code,
                    name: epci.label,
                })),
                { transaction },
            ))
        // fill mov_epci_2022
            .then(() => parser(
                fs.readFileSync(path.join(__dirname, '..', 'data', 'mov_epci_2022.csv'), { encoding: 'utf8' }),
                {
                    headers: ['oldCode', 'newCode',
                    ],
                    separator: ';',
                },
            ))
            .then(epcis => queryInterface.bulkInsert(
                'mov_epci_2022',
                epcis.map(mov_epci => ({
                    old_code: mov_epci.oldCode,
                    new_code: mov_epci.newCode,
                })),
                { transaction },
            ));

        await Promise.all([
            // updates on cities
            queryInterface.sequelize.query(
                'UPDATE cities SET fk_main = null WHERE fk_main IN (SELECT code FROM cities WHERE code NOT IN (SELECT code FROM cities_2022))',
                {
                    type: queryInterface.sequelize.QueryTypes.UPDATE,
                    transaction,
                },
            ),
            queryInterface.sequelize.query(
                'DELETE FROM organizations WHERE fk_city IN (SELECT code FROM cities WHERE code NOT IN (SELECT code FROM cities_2022))',
                {
                    type: queryInterface.sequelize.QueryTypes.DELETE,
                    transaction,
                },
            ),
            queryInterface.sequelize.query(
                'DELETE FROM cities WHERE code IN (SELECT code FROM cities WHERE code NOT IN (SELECT code FROM cities_2022))',
                {
                    type: queryInterface.sequelize.QueryTypes.DELETE,
                    transaction,
                },
            ),
            queryInterface.sequelize.query(
                `INSERT INTO cities (code, name, fk_epci, fk_departement)
                SELECT code, name, fk_epci, fk_departement
                FROM cities_2022
                WHERE code IN (SELECT code FROM cities_2022 WHERE cities_2022.code NOT IN (SELECT code FROM cities)
                )`,
                {
                    type: queryInterface.sequelize.QueryTypes.INSERT,
                    transaction,
                },
            ),
            queryInterface.sequelize.query(
                `WITH constant(type) AS (SELECT organization_type_id FROM organization_types WHERE name_singular = 'Commune')
                INSERT INTO organizations (name, active, fk_type, fk_city, being_funded)
                SELECT cities.name, false, constant.type, cities.code, false
                FROM  cities
                LEFT JOIN organizations ON organizations.fk_city = cities.code
                LEFT JOIN constant on true
                WHERE organizations.fk_city IS null`,
                {
                    type: queryInterface.sequelize.QueryTypes.INSERT,
                    transaction,
                },
            ),
            queryInterface.sequelize.query(
                'REFRESH MATERIALIZED VIEW localized_organizations',
                { transaction },
            ),
            queryInterface.sequelize.query(
                'UPDATE cities SET name = cities_2022.name FROM cities_2022 WHERE cities_2022.code = cities.code AND cities_2022.name != cities.name',
                {
                    type: queryInterface.sequelize.QueryTypes.UPDATE,
                    transaction,
                },
            ),
            // updates on EPCI
            queryInterface.sequelize.query(
                `INSERT INTO epci (code, name)
                SELECT code, name
                FROM epci_2022
                WHERE code IN (SELECT code FROM epci_2022 WHERE epci_2022.code NOT IN (SELECT code FROM epci)
                )`,
                {
                    type: queryInterface.sequelize.QueryTypes.INSERT,
                    transaction,
                },
            ),
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
            queryInterface.sequelize.query(
                `WITH constant(type) AS (SELECT organization_type_id FROM organization_types WHERE name_singular = 'Intercommunalité')
                INSERT INTO organizations (name, active, fk_type, fk_epci, being_funded)
                SELECT epci.name, false, constant.type, epci.code, false
                FROM  epci
                LEFT JOIN organizations ON organizations.fk_epci = epci.code
                LEFT JOIN constant on true
                WHERE organizations.fk_epci IS null`,
                {
                    type: queryInterface.sequelize.QueryTypes.INSERT,
                    transaction,
                },
            ),
            queryInterface.sequelize.query(
                `UPDATE users
               SET fk_organization = new_org.organization_id
               FROM organizations old_org
               INNER JOIN mov_epci_2022 ON mov_epci_2022.old_code = old_org.fk_epci
               LEFT JOIN organizations new_org ON mov_epci_2022.new_code = new_org.fk_epci
               WHERE users.fk_organization = old_org.organization_id
               
                `,
                {
                    type: queryInterface.sequelize.QueryTypes.UPDATE,
                    transaction,
                },
            ),
            queryInterface.sequelize.query(
                `UPDATE stats_directory_views
                SET organization = new_org.organization_id
                FROM organizations old_org
                INNER JOIN mov_epci_2022 ON mov_epci_2022.old_code = old_org.fk_epci
                LEFT JOIN organizations new_org ON mov_epci_2022.new_code = new_org.fk_epci
                WHERE stats_directory_views.organization = old_org.organization_id
               
                `,
                {
                    type: queryInterface.sequelize.QueryTypes.UPDATE,
                    transaction,
                },
            ),
            queryInterface.sequelize.query(
                `UPDATE stats_exports
                SET fk_epci = mov_epci_2022.new_code
                FROM mov_epci_2022 
                WHERE fk_epci = mov_epci_2022.old_code
                `,
                {
                    type: queryInterface.sequelize.QueryTypes.UPDATE,
                    transaction,
                },
            ),
            queryInterface.sequelize.query(
                'DELETE FROM organizations WHERE fk_epci IN (SELECT code FROM epci WHERE code NOT IN (SELECT code FROM epci_2022))',
                {
                    type: queryInterface.sequelize.QueryTypes.DELETE,
                    transaction,
                },
            ),
            queryInterface.sequelize.query(
                'REFRESH MATERIALIZED VIEW localized_organizations',
                { transaction },
            ),
            queryInterface.sequelize.query(
                'UPDATE epci SET name = epci_2022.name FROM epci_2022 WHERE epci_2022.code = epci.code AND epci_2022.name != epci.name',
                {
                    type: queryInterface.sequelize.QueryTypes.UPDATE,
                    transaction,
                },
            ),
            queryInterface.sequelize.query(
                'DELETE FROM epci WHERE code IN (SELECT code FROM epci WHERE code NOT IN (SELECT code FROM epci_2022))',
                {
                    type: queryInterface.sequelize.QueryTypes.DELETE,
                    transaction,
                },
            ),
            // delete temporary tables
            queryInterface.dropTable('cities_2022'),
            queryInterface.dropTable('epci_2022'),
            queryInterface.dropTable('mov_epci_2022'),
        ]);


        await transaction.commit();
    },


    async down() {
        await Promise.resolve();
    },
};
