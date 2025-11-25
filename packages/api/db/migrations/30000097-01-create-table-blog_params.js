module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable(
            'blog_params',
            {
                from_date: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                },
                to_date: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP + INTERVAL \'10 days\''),
                },
            },
        );
    },

    async down(queryInterface) {
        await queryInterface.dropTable('blog_params');
    },
};
