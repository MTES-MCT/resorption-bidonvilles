module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.createTable(
            'changelogs',
            {
                app_version: {
                    primaryKey: true,
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                date: {
                    type: Sequelize.DATEONLY,
                    allowNull: false,
                },
                created_at: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                },
                updated_at: {
                    type: Sequelize.DATE,
                    allowNull: true,
                    defaultValue: null,
                    onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
                },
            },
            {
                transaction,
            },
        ),
    ),

    down: queryInterface => queryInterface.dropTable('changelogs'),

};
