function addColumnsTo(queryInterface, Sequelize, tableName, transaction) {
    return Promise.all([
        queryInterface.addColumn(
            tableName,
            'updated_without_any_change',
            {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                allowNull: false,
            },
            {
                transaction,
            },
        ),
    ]);
}

function removeColumnsFrom(queryInterface, tableName, transaction) {
    return Promise.all([
        queryInterface.removeColumn(tableName, 'updated_without_any_change', { transaction }),
    ]);
}


module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await Promise.all([
                addColumnsTo(queryInterface, Sequelize, 'shantytowns', transaction),
                addColumnsTo(queryInterface, Sequelize, 'ShantytownHistories', transaction),
            ]);
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await Promise.all([
                removeColumnsFrom(queryInterface, 'shantytowns', transaction),
                removeColumnsFrom(queryInterface, 'ShantytownHistories', transaction),
            ]);

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
