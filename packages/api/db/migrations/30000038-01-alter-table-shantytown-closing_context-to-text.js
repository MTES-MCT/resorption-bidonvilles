module.exports = {

    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        await Promise.all(
            [
                queryInterface.changeColumn('shantytowns', 'closing_context', {
                    type: Sequelize.TEXT,
                    allowNull: true,
                },
                    { transaction },
                ),
                queryInterface.changeColumn('ShantytownHistories', 'closing_context', {
                    type: Sequelize.TEXT,
                    allowNull: true,
                },
                    { transaction },
                ),
            ],
        );
        return transaction.commit();
    },

    async down(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        await Promise.all(
            [
                queryInterface.changeColumn('shantytowns', 'closing_context', {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                    { transaction },
                ),
                queryInterface.changeColumn('ShantytownHistories', 'closing_context', {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                    { transaction },
                ),
            ],
        );
        return transaction.commit();
    }
};