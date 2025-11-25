const COLUMN_NAME = 'order';
const TABLE_NAMES = ['closing_solutions'];
const DEFAULT_ORDER_BY_ID = {
    7: 3,
    8: 2,
    9: 1,
    10: 4,
    11: 5,
};

const runInTransaction = async (queryInterface, callback) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
        await callback(transaction);
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

const addOrderColumnWithDefaults = async (queryInterface, Sequelize, tableName, transaction) => {
    await queryInterface.addColumn(
        tableName,
        COLUMN_NAME,
        {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        { transaction },
    );

    await Promise.all(
        Object.entries(DEFAULT_ORDER_BY_ID).map(([id, order]) => queryInterface.sequelize.query(
            `UPDATE "${tableName}"
                 SET "${COLUMN_NAME}" = :order, updated_at = NOW()
                 WHERE closing_solution_id = :id;`,
            {
                transaction,
                replacements: {
                    id: Number(id),
                    order,
                },
            },
        )),
    );
};

const removeOrderColumn = (queryInterface, tableName, transaction) => queryInterface.removeColumn(
    tableName,
    COLUMN_NAME,
    { transaction },
);

module.exports = {
    async up(queryInterface, Sequelize) {
        await runInTransaction(queryInterface, transaction => Promise.all(
            TABLE_NAMES.map(tableName => addOrderColumnWithDefaults(
                queryInterface,
                Sequelize,
                tableName,
                transaction,
            )),
        ));
    },

    async down(queryInterface) {
        await runInTransaction(queryInterface, transaction => Promise.all(
            TABLE_NAMES.map(tableName => removeOrderColumn(queryInterface, tableName, transaction)),
        ));
    },
};
