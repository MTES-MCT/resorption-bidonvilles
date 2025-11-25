module.exports = {
    async up(queryInterface, Sequelize) {
        try {
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
        } catch (error) {
            throw error;
        }
    },

    async down(queryInterface) {
        try {
            await queryInterface.dropTable('blog_params');
        } catch (error) {
            throw error;
        }
    },
};
