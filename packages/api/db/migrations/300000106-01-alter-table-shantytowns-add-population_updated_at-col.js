const COLUMN_NAME = 'population_updated_at';
const TABLE_NAMES = ['shantytowns', 'ShantytownHistories'];

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

const addPopulationUpdatedAtColumn = async (queryInterface, Sequelize, tableName, transaction) => {
    await queryInterface.addColumn(
        tableName,
        COLUMN_NAME,
        {
            type: Sequelize.DATE,
            allowNull: true,
        },
        { transaction },
    );
};

const removePopulationUpdatedAtColumn = (queryInterface, tableName, transaction) => queryInterface.removeColumn(
    tableName,
    COLUMN_NAME,
    { transaction },
);

module.exports = {
    async up(queryInterface, Sequelize) {
        await runInTransaction(queryInterface, transaction => Promise.all(
            TABLE_NAMES.map(tableName => addPopulationUpdatedAtColumn(
                queryInterface,
                Sequelize,
                tableName,
                transaction,
            )),
        ));
    },

    async down(queryInterface) {
        await runInTransaction(queryInterface, transaction => Promise.all(
            TABLE_NAMES.map(tableName => removePopulationUpdatedAtColumn(queryInterface, tableName, transaction)),
        ));
    },
};
