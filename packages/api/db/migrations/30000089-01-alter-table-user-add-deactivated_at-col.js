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
        queryInterface.sequelize.query(
            `UPDATE "${tableName}" SET deactivated_at = updated_at, deactivation_type = 'auto' WHERE fk_status = 'inactive' AND deactivated_at IS NULL;`,
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
