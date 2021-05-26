module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.createTable(
            'finance_rows_history',
            {
                fk_finance: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                fk_finance_type: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    primaryKey: true,
                },
                amount: {
                    type: Sequelize.DOUBLE,
                    allowNull: false,
                },
                comments: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                created_by: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                created_at: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                },
                updated_by: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                    defaultValue: null,
                },
                updated_at: {
                    type: Sequelize.DATE,
                    allowNull: true,
                    defaultValue: null,
                    onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
                },
            },
            {
                transaction,
            },
        )
            .then(() => queryInterface.addConstraint(
                'finance_rows_history',
                ['fk_finance'],
                {
                    type: 'foreign key',
                    name: 'fk_finance_rows_history_finance',
                    references: {
                        table: 'finances_history',
                        field: 'finance_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'cascade',
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
                'finance_rows_history',
                ['fk_finance_type'],
                {
                    type: 'foreign key',
                    name: 'fk_finance_rows_history_type',
                    references: {
                        table: 'finance_types',
                        field: 'uid',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'restrict',
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
                'finance_rows_history',
                ['created_by'],
                {
                    type: 'foreign key',
                    name: 'fk_finance_rows_history_creator',
                    references: {
                        table: 'users',
                        field: 'user_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'restrict',
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
                'finance_rows_history',
                ['updated_by'],
                {
                    type: 'foreign key',
                    name: 'fk_finance_rows_history_editor',
                    references: {
                        table: 'users',
                        field: 'user_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'restrict',
                    transaction,
                },
            )),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.removeConstraint(
            'finance_rows_history',
            'fk_finance_rows_history_creator',
            {
                transaction,
            },
        )
            .then(() => queryInterface.removeConstraint(
                'finance_rows_history',
                'fk_finance_rows_history_editor',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeConstraint(
                'finance_rows_history',
                'fk_finance_rows_history_type',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeConstraint(
                'finance_rows_history',
                'fk_finance_rows_history_finance',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.dropTable('finance_rows_history', { transaction })),
    ),

};
