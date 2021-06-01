const priorityProps = Sequelize => ({
    type: Sequelize.INTEGER,
    allowNull: true,
});

module.exports = {
    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => Promise.all([
            queryInterface.removeConstraint('shantytowns', 'check_priority_value', { transaction }),
            queryInterface.removeColumn(
                'shantytowns',
                'priority',
                {
                    transaction,
                },
            ),
            queryInterface.removeColumn(
                'ShantytownHistories',
                'priority',
                {
                    transaction,
                },
            ),
        ]),
    ),
    down: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => Promise.all([
            queryInterface.addColumn(
                'shantytowns',
                'priority',
                priorityProps(Sequelize),
                {
                    transaction,
                },
            ),
            queryInterface.addColumn(
                'ShantytownHistories',
                'priority',
                priorityProps(Sequelize),
                {
                    transaction,
                },
            ),
        ]),
    ).then(() => queryInterface.addConstraint('shantytowns', ['priority'], {
        type: 'check',
        name: 'check_priority_value',
        where: {
            [Sequelize.Op.and]: [
                {
                    priority: { [Sequelize.Op.gte]: 1 },
                },
                {
                    priority: { [Sequelize.Op.lte]: 4 },
                },
            ],
        },
    })),

};
