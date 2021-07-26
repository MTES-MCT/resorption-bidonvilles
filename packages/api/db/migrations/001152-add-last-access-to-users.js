function addColumn(queryInterface, Sequelize, tableName) {
    return queryInterface.addColumn(
        tableName,
        'last_access',
        {
            type: Sequelize.DATE,
            allowNull: true,
        },
    );
}

module.exports = {
    up: (queryInterface, Sequelize) => addColumn(queryInterface, Sequelize, 'users'),
    down: queryInterface => queryInterface.removeColumn('users', 'last_access'),
};
