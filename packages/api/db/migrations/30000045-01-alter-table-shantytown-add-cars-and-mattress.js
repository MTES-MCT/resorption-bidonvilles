module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await Promise.all(
                [
                    queryInterface.addColumn(
                        'shantytowns',
                        'cars',
                        {
                            type: Sequelize.INTEGER,
                            allowNull: true,
                        },
                        {
                            transaction,
                        },
                    ),
                    queryInterface.addColumn(
                        'shantytowns',
                        'mattresses',
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
                        'cars',
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
                        'mattresses',
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
                        'cars',
                        { transaction },
                    ),
                    queryInterface.removeColumn(
                        'shantytowns',
                        'mattresses',
                        { transaction },
                    ),
                    queryInterface.removeColumn(
                        'ShantytownHistories',
                        'cars',
                        { transaction },
                    ),
                    queryInterface.removeColumn(
                        'ShantytownHistories',
                        'mattresses',
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
