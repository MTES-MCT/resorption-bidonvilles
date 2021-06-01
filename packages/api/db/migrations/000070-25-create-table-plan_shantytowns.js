module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.createTable(
            'plan_shantytowns',
            {
                fk_plan: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                fk_shantytown: {
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
            'plan_shantytowns',
            ['fk_plan'],
            {
                type: 'foreign key',
                name: 'fk_plan_shantytowns_plan',
                references: {
                    table: 'plans2',
                    field: 'plan_id',
                },
                onUpdate: 'cascade',
                onDelete: 'cascade',
                transaction,
            },
        )).then(() => queryInterface.addConstraint(
            'plan_shantytowns',
            ['fk_shantytown'],
            {
                type: 'foreign key',
                name: 'fk_plan_shantytowns_shantytown',
                references: {
                    table: 'shantytowns',
                    field: 'shantytown_id',
                },
                onUpdate: 'cascade',
                onDelete: 'cascade',
                transaction,
            },
        ))
            .then(() => queryInterface.addConstraint(
                'plan_shantytowns',
                ['created_by'],
                {
                    type: 'foreign key',
                    name: 'fk_plan_shantytowns_creator',
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
                'plan_shantytowns',
                ['updated_by'],
                {
                    type: 'foreign key',
                    name: 'fk_plan_shantytowns_editor',
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
            'plan_shantytowns',
            'fk_plan_shantytowns_creator',
            {
                transaction,
            },
        )
            .then(() => queryInterface.removeConstraint(
                'plan_shantytowns',
                'fk_plan_shantytowns_editor',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeConstraint(
                'plan_shantytowns',
                'fk_plan_shantytowns_shantytown',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeConstraint(
                'plan_shantytowns',
                'fk_plan_shantytowns_plan',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.dropTable('plan_shantytowns', { transaction })),
    ),

};
