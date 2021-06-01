function addColumn(tableName, queryInterface, Sequelize, transaction) {
    return queryInterface.addColumn(
        tableName,
        'closed_with_solutions',
        {
            type: Sequelize.ENUM('unknown', 'yes', 'no'),
            allowNull: true,
            defaultValue: null,
        },
        {
            transaction,
        },
    );
}

function removeColumn(tableName, queryInterface, transaction) {
    return queryInterface.removeColumn(
        tableName,
        'closed_with_solutions',
        {
            transaction,
        },
    );
}

function updateAlreadyClosedShantytowns(tableName, queryInterface, Sequelize, transaction) {
    return queryInterface.bulkUpdate(
        tableName,
        {
            closed_with_solutions: 'unknown',
        },
        {
            status: { [Sequelize.Op.ne]: 'open' },
        },
        {
            transaction,
        },
    );
}

module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => addColumn('shantytowns', queryInterface, Sequelize, transaction)
            .then(() => addColumn('ShantytownHistories', queryInterface, Sequelize, transaction))
            .then(() => queryInterface.sequelize.query(
                `CREATE CAST (
                    "enum_shantytowns_closed_with_solutions" AS "enum_ShantytownHistories_closed_with_solutions"
                ) WITH INOUT AS ASSIGNMENT`,
                {
                    transaction,
                },
            ))
            .then(() => updateAlreadyClosedShantytowns('shantytowns', queryInterface, Sequelize, transaction))
            .then(() => updateAlreadyClosedShantytowns('ShantytownHistories', queryInterface, Sequelize, transaction)),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => removeColumn('shantytowns', queryInterface, transaction)
            .then(() => removeColumn('ShantytownHistories', queryInterface, transaction))
            .then(() => queryInterface.sequelize.query(
                'DROP TYPE "enum_shantytowns_closed_with_solutions" CASCADE',
                { transaction },
            ))
            .then(() => queryInterface.sequelize.query(
                'DROP TYPE "enum_ShantytownHistories_closed_with_solutions" CASCADE',
                { transaction },
            )),
    ),

};
