module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.createTable(
            'finances',
            {
                fk_plan: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                finance_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                },
                year: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                closed: {
                    type: Sequelize.BOOLEAN,
                    allowNull: false,
                    defaultValue: false,
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
                'finances',
                ['year', 'fk_plan'],
                {
                    type: 'unique',
                    name: 'uk_finances_year_unicity',
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
                'finances',
                ['fk_plan'],
                {
                    type: 'foreign key',
                    name: 'fk_finances_plan',
                    references: {
                        table: 'plans2',
                        field: 'plan_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'cascade',
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
                'finances',
                ['created_by'],
                {
                    type: 'foreign key',
                    name: 'fk_finances_creator',
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
                'finances',
                ['updated_by'],
                {
                    type: 'foreign key',
                    name: 'fk_finances_editor',
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
            'finances',
            'fk_finances_creator',
            {
                transaction,
            },
        )
            .then(() => queryInterface.removeConstraint(
                'finances',
                'fk_finances_editor',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeConstraint(
                'finances',
                'fk_finances_plan',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeConstraint(
                'finances',
                'uk_finances_year_unicity',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.dropTable('finances', { transaction })),
    ),

};
