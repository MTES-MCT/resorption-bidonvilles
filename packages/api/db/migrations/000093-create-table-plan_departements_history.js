module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.createTable(
            'plan_departements_history',
            {
                hid: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                },
                plan_departement_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                fk_plan: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                fk_departement: {
                    type: Sequelize.STRING,
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
        )
            .then(() => queryInterface.addConstraint(
                'plan_departements_history',
                ['fk_plan'],
                {
                    type: 'foreign key',
                    name: 'fk_plan_departements_history_plan',
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
                'plan_departements_history',
                ['fk_departement'],
                {
                    type: 'foreign key',
                    name: 'fk_plan_departements_history_departement',
                    references: {
                        table: 'departements',
                        field: 'code',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'restrict',
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
                'plan_departements_history',
                ['created_by'],
                {
                    type: 'foreign key',
                    name: 'fk_plan_departements_history_creator',
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
                'plan_departements_history',
                ['updated_by'],
                {
                    type: 'foreign key',
                    name: 'fk_plan_departements_history_editor',
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
            'plan_departements_history',
            'fk_plan_departements_history_editor',
            {
                transaction,
            },
        )
            .then(() => queryInterface.removeConstraint(
                'plan_departements_history',
                'fk_plan_departements_history_creator',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeConstraint(
                'plan_departements_history',
                'fk_plan_departements_history_departement',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeConstraint(
                'plan_departements_history',
                'fk_plan_departements_history_plan',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.dropTable('plan_departements_history', { transaction })),
    ),

};
