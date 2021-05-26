function addColumnTo(queryInterface, Sequelize, table) {
    return queryInterface.addColumn(
        table,
        'priority',
        {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 4,
        },
    );
}

function addConstraintTo(queryInterface, Sequelize, table) {
    queryInterface.addConstraint(table, ['priority'], {
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
    });
}

module.exports = {
    up: (queryInterface, Sequelize) => Promise.all([
        addColumnTo(queryInterface, Sequelize, 'shantytowns'),
        addColumnTo(queryInterface, Sequelize, 'ShantytownHistories'),
    ]).then(() => Promise.all([
        addConstraintTo(queryInterface, Sequelize, 'shantytowns'),
        addConstraintTo(queryInterface, Sequelize, 'ShantytownHistories'),
    ])),

    down: queryInterface => Promise.all([
        queryInterface.removeColumn('shantytowns', 'priority'),
        queryInterface.removeColumn('ShantytownHistories', 'priority'),
    ]),
};
