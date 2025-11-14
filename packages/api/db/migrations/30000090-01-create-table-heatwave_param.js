module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await queryInterface.createTable(
                'heatwave_param',
                {
                    start_date: {
                        type: Sequelize.DATE,
                        allowNull: false,
                    },
                    end_date: {
                        type: Sequelize.DATE,
                        allowNull: false,
                    },
                },
                { transaction },
            );

            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await queryInterface.dropTable('heatwave_param', { transaction });
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
