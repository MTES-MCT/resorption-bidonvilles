module.exports = {
    up: queryInterface => Promise.all([
        queryInterface.removeColumn('shantytowns', 'census_requested_at'),
    ]),

    // @todo : in real-life, we should backup the value from ShantytownHistories...
    // @todo : also, i'm not fan of duplicating the definition of census_requested_at here
    down: (queryInterface, Sequelize) => Promise.all([
        queryInterface.addColumn(
            'shantytowns',
            'census_requested_at',
            {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },
        ),
    ]),
};
