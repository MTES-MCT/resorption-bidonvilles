function makePriorityNullable(queryInterface, Sequelize, table, transaction) {
    return queryInterface.changeColumn(
        table,
        'priority',
        {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        {
            transaction,
        },
    );
}

function makePriorityNonNullable(queryInterface, Sequelize, table, transaction) {
    return queryInterface.bulkUpdate(
        table,
        {
            priority: 4,
        },
        undefined,
        {
            transaction,
        },
    ).then(() => queryInterface.changeColumn(
        table,
        'priority',
        {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 4,
        },
        {
            transaction,
        },
    ));
}

module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize
        .transaction(t => makePriorityNullable(queryInterface, Sequelize, 'shantytowns', t)
            .then(() => makePriorityNullable(queryInterface, Sequelize, 'ShantytownHistories', t))),

    down: (queryInterface, Sequelize) => queryInterface.sequelize
        .transaction(t => makePriorityNonNullable(queryInterface, Sequelize, 'shantytowns', t)
            .then(() => makePriorityNonNullable(queryInterface, Sequelize, 'ShantytownHistories', t))),

};
