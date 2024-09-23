module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable(
        'shantytown_decrees',
        {
            shantytown_decree_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            fk_shantytown: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            fk_attachement: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            created_by: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        },
    ),

    down: queryInterface => queryInterface.dropTable('shantytown_decrees'),
};
