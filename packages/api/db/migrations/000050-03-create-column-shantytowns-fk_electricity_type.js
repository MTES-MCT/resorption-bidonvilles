function addColumnTo(queryInterface, Sequelize, table) {
    return queryInterface.addColumn(
        table,
        'fk_electricity_type',
        {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
    );
}

module.exports = {

    up: (queryInterface, Sequelize) => Promise.all([
        addColumnTo(queryInterface, Sequelize, 'shantytowns'),
        addColumnTo(queryInterface, Sequelize, 'ShantytownHistories'),
    ]),

    down: queryInterface => Promise.all([
        queryInterface.removeColumn('shantytowns', 'fk_electricity_type'),
        queryInterface.removeColumn('ShantytownHistories', 'fk_electricity_type'),
    ]),

};
