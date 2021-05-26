function addConstraint(tableName, queryInterface, Sequelize, transaction) {
    return queryInterface.addConstraint(
        tableName,
        {
            type: 'check',
            name: 'check_closed_with_solutions',
            fields: ['status', 'closed_with_solutions'],
            where: {
                [Sequelize.Op.or]: [
                    {
                        [Sequelize.Op.and]: {
                            status: { [Sequelize.Op.eq]: 'open' },
                            closed_with_solutions: { [Sequelize.Op.eq]: null },
                        },
                    },
                    {
                        [Sequelize.Op.and]: {
                            status: { [Sequelize.Op.ne]: 'open' },
                            closed_with_solutions: { [Sequelize.Op.ne]: null },
                        },
                    },
                ],
            },
            transaction,
        },
    );
}

function removeConstraint(tableName, queryInterface, transaction) {
    return queryInterface.removeConstraint(tableName, 'check_closed_with_solutions', { transaction });
}

module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => addConstraint('shantytowns', queryInterface, Sequelize, transaction)
            .then(() => addConstraint('ShantytownHistories', queryInterface, Sequelize, transaction)),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => removeConstraint('shantytowns', queryInterface, transaction)
            .then(() => removeConstraint('ShantytownHistories', queryInterface, transaction)),
    ),

};
