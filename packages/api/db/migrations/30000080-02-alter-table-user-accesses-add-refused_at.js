function addColumnsTo(queryInterface, Sequelize, tableName, transaction) {
    return Promise.all([
        queryInterface.addColumn(
            tableName,
            'refused_at',
            {
                type: Sequelize.DATE(6),
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
        queryInterface.removeColumn(tableName, 'refused_at', { transaction }),
    ]);
}


module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await Promise.all([
                addColumnsTo(queryInterface, Sequelize, 'user_accesses', transaction),
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
                removeColumnsFrom(queryInterface, 'user_accesses', transaction),
            ]);

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
