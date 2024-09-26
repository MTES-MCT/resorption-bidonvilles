module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable(
        'shantytown_decrees',
        {
            shantytown_decree_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                autoIncrement: true,
                primaryKey: true,
            },
            fk_shantytown: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            fk_attachment: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
        },
    ),

    down: queryInterface => queryInterface.dropTable('shantytown_decrees'),
};
