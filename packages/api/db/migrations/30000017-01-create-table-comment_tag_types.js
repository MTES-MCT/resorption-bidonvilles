module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable(
        'comment_tag_types',
        {
            uid: {
                type: Sequelize.STRING(50),
                primaryKey: true,
            },
            name: {
                type: Sequelize.STRING(75),
                allowNull: false,
            },
        },
    ),

    down: queryInterface => queryInterface.dropTable('comment_tag_types'),
};
