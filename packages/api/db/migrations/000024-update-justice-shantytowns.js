function addColumn(queryInterface, name, options, queryOptions) {
    return Promise.all([
        queryInterface.addColumn('shantytowns', name, options, queryOptions),
        queryInterface.addColumn('ShantytownHistories', name, options, queryOptions),
    ]);
}

function removeColumn(queryInterface, name, options) {
    return Promise.all([
        queryInterface.removeColumn('shantytowns', name, options),
        queryInterface.removeColumn('ShantytownHistories', name, options),
    ]);
}

module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => Promise.all([
            // @todo : we should probably have constraints over those fields
            addColumn(
                queryInterface,
                'justice_procedure',
                {
                    type: Sequelize.BOOLEAN,
                    allowNull: true,
                },
                {
                    transaction,
                },
            ),
            addColumn(
                queryInterface,
                'justice_rendered',
                {
                    type: Sequelize.BOOLEAN,
                    allowNull: true,
                },
                {
                    transaction,
                },
            ),
            addColumn(
                queryInterface,
                'justice_challenged',
                {
                    type: Sequelize.BOOLEAN,
                    allowNull: true,
                },
                {
                    transaction,
                },
            ),
        ])
            .then(() => queryInterface.removeColumn('shantytowns', 'justice_status', { transaction }))
            .then(() => queryInterface.sequelize.query('DROP TYPE "enum_shantytowns_justice_status" CASCADE', { transaction })),
    ),

    down: (queryInterface, Sequelize) => Promise.all([
        removeColumn(queryInterface, 'justice_procedure'),
        removeColumn(queryInterface, 'justice_rendered'),
        removeColumn(queryInterface, 'justice_challenged'),
        queryInterface.addColumn(
            // @todo : in real-life, we should backup the value from ShantytownHistories...
            // @todo : also, i'm not fan of duplicating the definition of justice_status here
            'shantytowns',
            'justice_status',
            {
                type: Sequelize.ENUM('none', 'seized', 'rendered'),
                allowNull: true,
            },
        ),
    ]),
};
