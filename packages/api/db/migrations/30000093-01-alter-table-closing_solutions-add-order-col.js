async function addColumnsTo(queryInterface, Sequelize, tableName, transaction) {
    const initialOrder = {
        7: 3,
        8: 2,
        9: 1,
        10: 4,
        11: 5,
    };
    Promise.all([
        queryInterface.addColumn(
            tableName,
            'order',
            {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            {
                transaction,
            },
        ),
        Object.entries(initialOrder).map(([id, order]) => queryInterface.sequelize.query(
            `UPDATE "${tableName}"
                 SET "order" = :order, updated_at = NOW()
                 WHERE closing_solution_id = :id;`,
            {
                transaction,
                replacements: {
                    id: Number(id),
                    order,
                },
            },
        )),
    ]);
}

async function removeColumnsFrom(queryInterface, tableName, transaction) {
    return Promise.all([
        queryInterface.removeColumn(tableName, 'order', { transaction }),
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
        await addOrDeleteTableColumns('up', ['closing_solutions'], queryInterface, Sequelize);
    },

    async down(queryInterface) {
        await addOrDeleteTableColumns('down', ['closing_solutions'], queryInterface);
    },
};
