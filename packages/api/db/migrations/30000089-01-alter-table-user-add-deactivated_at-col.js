async function addColumnsTo(queryInterface, Sequelize, tableName, transaction) {
    Promise.all([
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
            `UPDATE "${tableName}" SET deactivated_at = updated_at, deactivation_type = 'unknown' WHERE fk_status = 'inactive' AND deactivated_at IS NULL;`,
            {
                transaction,
            },
        ),
    ]);
}

async function removeColumnsFrom(queryInterface, tableName, transaction) {
    return Promise.all([
        queryInterface.removeColumn(tableName, 'deactivated_at', { transaction }),
    ]);
}

async function addOrDeleteTableColumns(upOrDown, tableNames, queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
        await Promise.all(
            tableNames.map((tableName) => {
                if (upOrDown === 'up') {
                    return addColumnsTo(queryInterface, Sequelize, tableName, transaction);
                }
                if (upOrDown === 'down') {
                    return removeColumnsFrom(queryInterface, tableName, transaction);
                }
                return Promise.resolve();
            }),
        );
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

module.exports = {
    async up(queryInterface, Sequelize) {
        await addOrDeleteTableColumns('up', ['users'], queryInterface, Sequelize);
    },

    async down(queryInterface) {
        await addOrDeleteTableColumns('down', ['users'], queryInterface);
    },
};
