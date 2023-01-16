module.exports = {

    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        await Promise.all(
            [
                queryInterface.changeColumn('shantytowns', 'water_access_comments', {
                    type: Sequelize.TEXT,
                    allowNull: true,
                },
                    { transaction },
                ),
                queryInterface.changeColumn('ShantytownHistories', 'water_access_comments', {
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
                queryInterface.changeColumn('shantytowns', 'water_access_comments', {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                    { transaction },
                ),
                queryInterface.changeColumn('ShantytownHistories', 'water_access_comments', {
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
