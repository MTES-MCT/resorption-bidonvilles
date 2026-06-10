const runWithinTransaction = require('./common/helpers/transaction');

const COLUMN_NAME = 'is_principal';
const TABLE_NAMES = ['action_operators', 'action_operators_history'];

const addIsPrincipalColumn = async (queryInterface, Sequelize, tableName, transaction) => {
    await queryInterface.addColumn(
        tableName,
        COLUMN_NAME,
        {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        { transaction },
    );
};

const removeIsPrincipalColumn = (queryInterface, tableName, transaction) => queryInterface.removeColumn(
    tableName,
    COLUMN_NAME,
    { transaction },
);

module.exports = {
    async up(queryInterface, Sequelize) {
        await runWithinTransaction(queryInterface, async (transaction) => {
            await Promise.all(TABLE_NAMES.map(tableName => addIsPrincipalColumn(queryInterface, Sequelize, tableName, transaction)));
        });
    },

    async down(queryInterface) {
        await runWithinTransaction(queryInterface, async (transaction) => {
            await Promise.all(TABLE_NAMES.map(tableName => removeIsPrincipalColumn(queryInterface, tableName, transaction)));
        });
    },
};
