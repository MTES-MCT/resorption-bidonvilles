
module.exports = {

    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        // remove organizations for cities or epci that do not exist anymore
        await Promise.all([
            queryInterface.sequelize.query(
                `DELETE FROM organizations
                 WHERE fk_city NOT IN (SELECT code FROM cities_2022)
                    OR fk_epci NOT IN (SELECT code FROM epci_2022)`,
                {
                    type: queryInterface.sequelize.QueryTypes.DELETE,
                    transaction,
                },
            ),
        ]);
        await queryInterface.sequelize.query(
            'REFRESH MATERIALIZED VIEW localized_organizations',
            { transaction },
        );

        // remove cities and epci that do not exist anymore
        await queryInterface.sequelize.query(
            'UPDATE cities SET fk_main = null WHERE fk_main NOT IN (SELECT code FROM cities_2022)',
            {
                type: queryInterface.sequelize.QueryTypes.UPDATE,
                transaction,
            },
        );

        await Promise.all([
            queryInterface.sequelize.query(
                'DELETE FROM cities WHERE code NOT IN (SELECT code FROM cities_2022)',
                {
                    type: queryInterface.sequelize.QueryTypes.DELETE,
                    transaction,
                },
            ),
            queryInterface.sequelize.query(
                'DELETE FROM epci WHERE code NOT IN (SELECT code FROM epci_2022)',
                {
                    type: queryInterface.sequelize.QueryTypes.DELETE,
                    transaction,
                },
            ),
        ]);

        // delete temporary tables
        await Promise.all([
            queryInterface.dropTable('cities_2022', { transaction }),
            queryInterface.dropTable('epci_2022', { transaction }),
        ]);

        return transaction.commit();
    },

    down: () => Promise.resolve(),
};
