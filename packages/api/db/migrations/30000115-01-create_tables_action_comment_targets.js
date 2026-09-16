const runWithinTransaction = require('./common/helpers/transaction');

const TARGET_TABLES = [
    {
        tableName: 'action_comment_organization_targets',
        fkColumn: 'fk_organization',
        fkLabel: 'organization',
        refTable: 'organizations',
        refColumn: 'organization_id',
    },
    {
        tableName: 'action_comment_user_targets',
        fkColumn: 'fk_user',
        fkLabel: 'user',
        refTable: 'users',
        refColumn: 'user_id',
    },
];

const createTargetTable = async (queryInterface, Sequelize, transaction, {
    tableName, fkColumn, fkLabel, refTable, refColumn,
}) => {
    await queryInterface.createTable(
        tableName,
        {
            [fkColumn]: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            fk_comment: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        },
        { transaction },
    );

    await Promise.all([
        queryInterface.addConstraint(
            tableName,
            {
                fields: [fkColumn],
                type: 'foreign key',
                name: `fk__${tableName}__${fkLabel}`,
                references: {
                    table: refTable,
                    field: refColumn,
                },
                onDelete: 'restrict',
                onUpdate: 'cascade',
                transaction,
            },
        ),
        queryInterface.addConstraint(
            tableName,
            {
                fields: ['fk_comment'],
                type: 'foreign key',
                name: `fk__${tableName}__comment`,
                references: {
                    table: 'action_comments',
                    field: 'action_comment_id',
                },
                onDelete: 'cascade',
                onUpdate: 'cascade',
                transaction,
            },
        ),
    ]);
};

const dropTargetTable = async (queryInterface, transaction, { tableName, fkLabel }) => {
    await Promise.all([
        queryInterface.removeConstraint(tableName, `fk__${tableName}__${fkLabel}`, { transaction }),
        queryInterface.removeConstraint(tableName, `fk__${tableName}__comment`, { transaction }),
    ]);

    await queryInterface.dropTable(tableName, { transaction });
};

module.exports = {
    async up(queryInterface, Sequelize) {
        await runWithinTransaction(queryInterface, async (transaction) => {
            await Promise.all(
                TARGET_TABLES.map(target => createTargetTable(queryInterface, Sequelize, transaction, target)),
            );
        });
    },

    async down(queryInterface) {
        await runWithinTransaction(queryInterface, async (transaction) => {
            await Promise.all(
                TARGET_TABLES.map(target => dropTargetTable(queryInterface, transaction, target)),
            );
        });
    },
};
