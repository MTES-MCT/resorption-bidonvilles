function addColumnsTo(queryInterface, Sequelize, tableName, transaction) {
    return Promise.all([
        queryInterface.addColumn(
            tableName,
            'deactivated_at',
            {
                type: Sequelize.DATE,
                allowNull: true,
            },
            {
                transaction,
            },
        ),
    ]);
}

function removeColumnsFrom(queryInterface, tableName, transaction) {
    return Promise.all([
        queryInterface.removeColumn(tableName, 'deactivated_at', { transaction }),
    ]);
}


module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await Promise.all([
                addColumnsTo(queryInterface, Sequelize, 'users', transaction),
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
                removeColumnsFrom(queryInterface, 'users', transaction),
            ]);

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
