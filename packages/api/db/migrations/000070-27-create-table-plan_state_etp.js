module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.createTable(
            'plan_state_etp',
            {
                fk_plan_state: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                fk_etp_type: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    primaryKey: true,
                },
                total: {
                    type: Sequelize.DOUBLE,
                    allowNull: false,
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
            'plan_state_etp',
            ['fk_plan_state'],
            {
                type: 'foreign key',
                name: 'fk_plan_state_etp_state',
                references: {
                    table: 'plan_states',
                    field: 'plan_state_id',
                },
                onUpdate: 'cascade',
                onDelete: 'cascade',
                transaction,
            },
        )).then(() => queryInterface.addConstraint(
            'plan_state_etp',
            ['fk_etp_type'],
            {
                type: 'foreign key',
                name: 'fk_plan_state_etp_type',
                references: {
                    table: 'etp_types',
                    field: 'uid',
                },
                onUpdate: 'cascade',
                onDelete: 'restrict',
                transaction,
            },
        ))
            .then(() => queryInterface.addConstraint(
                'plan_state_etp',
                ['created_by'],
                {
                    type: 'foreign key',
                    name: 'fk_plan_state_etp_creator',
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
                'plan_state_etp',
                ['updated_by'],
                {
                    type: 'foreign key',
                    name: 'fk_plan_state_etp_editor',
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
            'plan_state_etp',
            'fk_plan_state_etp_state',
            {
                transaction,
            },
        )
            .then(() => queryInterface.removeConstraint(
                'plan_state_etp',
                'fk_plan_state_etp_type',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeConstraint(
                'plan_state_etp',
                'fk_plan_state_etp_creator',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeConstraint(
                'plan_state_etp',
                'fk_plan_state_etp_editor',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.dropTable('plan_state_etp', { transaction })),
    ),

};
