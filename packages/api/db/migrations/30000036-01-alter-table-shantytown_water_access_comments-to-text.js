module.exports = {

    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await Promise.all(
                [
                    queryInterface.changeColumn('shantytowns', 'water_access_comments', {
                        type: Sequelize.TEXT,
                        allowNull: true,
                    },
                    { transaction }),
                    queryInterface.changeColumn('ShantytownHistories', 'water_access_comments', {
                        type: Sequelize.TEXT,
                        allowNull: true,
                    },
                    { transaction }),
                ],
            );
            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    async down(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await Promise.all(
                [
                    queryInterface.changeColumn('shantytowns', 'water_access_comments', {
                        type: Sequelize.STRING,
                        allowNull: true,
                    },
                    { transaction }),
                    queryInterface.changeColumn('ShantytownHistories', 'water_access_comments', {
                        type: Sequelize.STRING,
                        allowNull: true,
                    },
                    { transaction }),
                ],
            );
            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
