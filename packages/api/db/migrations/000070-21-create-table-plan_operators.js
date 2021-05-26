module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.createTable(
            'plan_operators',
            {
                fk_plan: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                fk_user: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
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
        ).then(() => queryInterface.addConstraint(
            'plan_operators',
            ['fk_plan'],
            {
                type: 'foreign key',
                name: 'fk_plan_operators_plan',
                references: {
                    table: 'plans2',
                    field: 'plan_id',
                },
                onUpdate: 'cascade',
                onDelete: 'cascade',
                transaction,
            },
        )).then(() => queryInterface.addConstraint(
            'plan_operators',
            ['fk_user'],
            {
                type: 'foreign key',
                name: 'fk_plan_operators_operator',
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
                'plan_operators',
                ['created_by'],
                {
                    type: 'foreign key',
                    name: 'fk_plan_operators_creator',
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
                'plan_operators',
                ['updated_by'],
                {
                    type: 'foreign key',
                    name: 'fk_plan_operators_editor',
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
            'plan_operators',
            'fk_plan_operators_creator',
            {
                transaction,
            },
        )
            .then(() => queryInterface.removeConstraint(
                'plan_operators',
                'fk_plan_operators_editor',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeConstraint(
                'plan_operators',
                'fk_plan_operators_operator',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeConstraint(
                'plan_operators',
                'fk_plan_operators_plan',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.dropTable('plan_operators', { transaction })),
    ),

};
