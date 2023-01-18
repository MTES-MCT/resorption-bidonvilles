module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await Promise.all(
                [
                    queryInterface.addColumn(
                        'shantytowns',
                        'tents',
                        {
                            type: Sequelize.INTEGER,
                            allowNull: true,
                        },
                        {
                            transaction,
                        },
                    ),
                    queryInterface.addColumn(
                        'ShantytownHistories',
                        'tents',
                        {
                            type: Sequelize.INTEGER,
                            allowNull: true,
                        },
                        {
                            transaction,
                        },
                    ),
                ],
            );
            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },


    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await Promise.all(
                [
                    queryInterface.removeColumn(
                        'shantytowns',
                        'tents',
                        { transaction },
                    ),
                    queryInterface.removeColumn(
                        'ShantytownHistories',
                        'tents',
                        { transaction },
                    ),
                ],
            );
            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
