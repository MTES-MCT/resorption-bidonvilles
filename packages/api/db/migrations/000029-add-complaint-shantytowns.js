function addColumnTo(queryInterface, Sequelize, table) {
    return queryInterface.addColumn(
        table,
        'owner_complaint',
        {
            type: Sequelize.BOOLEAN,
            allowNull: true,
        },
    );
}

module.exports = {
    up: (queryInterface, Sequelize) => Promise.all([
        addColumnTo(queryInterface, Sequelize, 'shantytowns'),
        addColumnTo(queryInterface, Sequelize, 'ShantytownHistories'),
    ]).then(() => Promise.all([
        queryInterface.sequelize.query('UPDATE shantytowns SET owner_complaint = TRUE WHERE justice_procedure = TRUE'),
        queryInterface.sequelize.query('UPDATE "ShantytownHistories" SET owner_complaint = TRUE WHERE justice_procedure = TRUE'),
    ])),

    down: queryInterface => Promise.all([
        queryInterface.removeColumn('shantytowns', 'owner_complaint'),
        queryInterface.removeColumn('ShantytownHistories', 'owner_complaint'),
    ]),
};
