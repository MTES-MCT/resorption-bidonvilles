module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.createTable(
            'permission_options',
            {
                uid: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    primaryKey: true,
                },
                name: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
            },
            {
                transaction,
            },
        )
            .then(() => queryInterface.addConstraint(
                'permission_options',
                ['name'],
                {
                    type: 'unique',
                    name: 'uk_permission_options_name',
                    transaction,
                },
            )),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.removeConstraint(
            'permission_options',
            'uk_permission_options_name',
            {
                transaction,
            },
        )
            .then(() => queryInterface.dropTable('permission_options', { transaction })),
    ),

};
