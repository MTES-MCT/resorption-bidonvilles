function addColumns(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(
        transaction => Promise.all([
            queryInterface.addColumn(
                'regions',
                'latitude',
                {
                    type: Sequelize.DOUBLE,
                    allowNull: true,
                },
                { transaction },
            ),
            queryInterface.addColumn(
                'regions',
                'longitude',
                {
                    type: Sequelize.DOUBLE,
                    allowNull: true,
                },
                { transaction },
            ),
        ]),
    );
}

function removeColumns(queryInterface) {
    return queryInterface.sequelize.transaction(
        transaction => Promise.all([
            queryInterface.removeColumn('regions', 'latitude', { transaction }),
            queryInterface.removeColumn('regions', 'longitude', { transaction }),
        ]),
    );
}

module.exports = {
    up: (queryInterface, Sequelize) => addColumns(queryInterface, Sequelize),

    down: queryInterface => removeColumns(queryInterface),
};
