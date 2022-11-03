

module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => Promise.all([
            queryInterface.addColumn(
                'shantytowns',
                'sanitary_comments',
                {
                    type: Sequelize.TEXT,
                    allowNull: true,
                },
                {
                    transaction,
                },
            ),
            queryInterface.addColumn(
                'ShantytownHistories',
                'sanitary_comments',
                {
                    type: Sequelize.TEXT,
                    allowNull: true,
                },
                {
                    transaction,
                },
            ),
            queryInterface.addColumn(
                'shantytowns',
                'access_to_sanitary',
                {
                    type: Sequelize.BOOLEAN,
                    allowNull: true,
                },
                {
                    transaction,
                },
            ),
            queryInterface.addColumn(
                'ShantytownHistories',
                'access_to_sanitary',
                {
                    type: Sequelize.BOOLEAN,
                    allowNull: true,
                },
                {
                    transaction,
                },
            )]),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => Promise.all([
            queryInterface.removeColumn(
                'shantytowns',
                'sanitary_comments',
                { transaction },
            ),
            queryInterface.removeColumn(
                'ShantytownHistories',
                'sanitary_comments',
                { transaction },
            ),
            queryInterface.removeColumn(
                'shantytowns',
                'access_to_sanitary',
                { transaction },
            ),
            queryInterface.removeColumn(
                'ShantytownHistories',
                'access_to_sanitary',
                { transaction },
            ),
        ]),

    ),
};
