
module.exports = {

    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        await Promise.all([
            // updates on cities
            queryInterface.sequelize.query(
                'DELETE FROM organizations WHERE fk_city NOT IN (SELECT code FROM cities_2022)',
                {
                    type: queryInterface.sequelize.QueryTypes.DELETE,
                    transaction,
                },
            ),
            queryInterface.sequelize.query(
                'DELETE FROM cities WHERE code NOT IN (SELECT code FROM cities_2022)',
                {
                    type: queryInterface.sequelize.QueryTypes.DELETE,
                    transaction,
                },
            ),
            queryInterface.sequelize.query(
                'DELETE FROM organizations WHERE fk_epci NOT IN (SELECT code FROM epci_2022)',
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
                'DELETE FROM epci WHERE code NOT IN (SELECT code FROM epci_2022)',
                {
                    type: queryInterface.sequelize.QueryTypes.DELETE,
                    transaction,
                },
            ),
            // delete temporary tables
            queryInterface.dropTable('cities_2022', { transaction }),
            queryInterface.dropTable('epci_2022', { transaction }),
        ]);

        return transaction.commit();
    },

    down: () => Promise.resolve(),
};
