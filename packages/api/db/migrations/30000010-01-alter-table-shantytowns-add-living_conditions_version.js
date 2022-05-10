module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        // create a new column
        const columnDefinition = {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 2,
        };

        await Promise.all([
            queryInterface.addColumn(
                'shantytowns',
                'living_conditions_version',
                columnDefinition,
                { transaction },
            ),
            queryInterface.addColumn(
                'ShantytownHistories',
                'living_conditions_version',
                columnDefinition,
                { transaction },
            ),
        ]);

        // mark all existing towns as version 1
        await Promise.all([
            queryInterface.sequelize.query(
                'UPDATE shantytowns SET living_conditions_version = 1',
                { transaction },
            ),
            queryInterface.sequelize.query(
                'UPDATE "ShantytownHistories" SET living_conditions_version = 1',
                { transaction },
            ),
        ]);

        await transaction.commit();
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        // create a new column
        await Promise.all([
            queryInterface.removeColumn(
                'shantytowns',
                'living_conditions_version',
                { transaction },
            ),
            queryInterface.removeColumn(
                'ShantytownHistories',
                'living_conditions_version',
                { transaction },
            ),
        ]);

        await transaction.commit();
    },
};
