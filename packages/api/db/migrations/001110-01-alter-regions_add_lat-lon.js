function addColumns(queryInterface, Sequelize) {
    return Promise.all([
        queryInterface.addColumn(
            'regions',
            'latitude',
            {
                type: Sequelize.DOUBLE,
                allowNull: true,
            },
        ),
        queryInterface.addColumn(
            'regions',
            'longitude',
            {
                type: Sequelize.DOUBLE,
                allowNull: true,
            },
        ),
    ]);
}

function removeColumns(queryInterface) {
    return Promise.all([
        queryInterface.removeColumn('regions', 'latitude'),
        queryInterface.removeColumn('regions', 'longitude'),
    ]);
}

module.exports = {
    up: (queryInterface, Sequelize) => addColumns(queryInterface, Sequelize),

    down: queryInterface => removeColumns(queryInterface),
};
