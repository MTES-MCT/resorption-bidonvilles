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

async function addOrDeleteTableColumns(upOrDown, tableNames, queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
        await Promise.all(
            tableNames.map((tableName) => {
                if (upOrDown === 'up') {
                    return addColumnsTo(queryInterface, Sequelize, tableName, transaction);
                }
                return removeColumnsFrom(queryInterface, tableName, transaction);
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
        await addOrDeleteTableColumns('up', ['shantytowns', 'ShantytownHistories'], queryInterface, Sequelize);
    },

    async down(queryInterface) {
        await addOrDeleteTableColumns('down', ['shantytowns', 'ShantytownHistories'], queryInterface);
    },
};
