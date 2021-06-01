module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.createTable(
            'plan_states',
            {
                plan_state_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                },
                date: {
                    type: Sequelize.DATE,
                    allowNull: false,
                },
                fk_plan: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                fk_audience_in: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                fk_audience_out_positive: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                fk_audience_out_abandoned: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                fk_audience_out_excluded: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                fk_indicateurs_commun: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                fk_indicateurs_sante: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                fk_indicateurs_logement: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                fk_indicateurs_formation: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                fk_indicateurs_education: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                fk_indicateurs_securisation: {
                    type: Sequelize.INTEGER,
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
                'plan_states',
                ['date', 'fk_plan'],
                {
                    type: 'unique',
                    name: 'uk_plan_states_date_unicity',
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
                'plan_states',
                ['fk_plan'],
                {
                    type: 'foreign key',
                    name: 'fk_plan_states_plan',
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
                'plan_states',
                ['fk_audience_in'],
                {
                    type: 'foreign key',
                    name: 'fk_plan_states_audience_in',
                    references: {
                        table: 'audiences',
                        field: 'audience_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'restrict',
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
                'plan_states',
                ['fk_audience_out_positive'],
                {
                    type: 'foreign key',
                    name: 'fk_plan_states_audience_out_positive',
                    references: {
                        table: 'audiences',
                        field: 'audience_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'restrict',
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
                'plan_states',
                ['fk_audience_out_abandoned'],
                {
                    type: 'foreign key',
                    name: 'fk_plan_states_audience_out_abandoned',
                    references: {
                        table: 'audiences',
                        field: 'audience_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'restrict',
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
                'plan_states',
                ['fk_audience_out_excluded'],
                {
                    type: 'foreign key',
                    name: 'fk_plan_states_audience_out_excluded',
                    references: {
                        table: 'audiences',
                        field: 'audience_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'restrict',
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
                'plan_states',
                ['fk_indicateurs_commun'],
                {
                    type: 'foreign key',
                    name: 'fk_plan_states_indicateurs_commun',
                    references: {
                        table: 'indicateurs_droit_commun',
                        field: 'indicateurs_droit_commun_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'restrict',
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
                'plan_states',
                ['fk_indicateurs_sante'],
                {
                    type: 'foreign key',
                    name: 'fk_plan_states_indicateurs_sante',
                    references: {
                        table: 'indicateurs_sante',
                        field: 'indicateurs_sante_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'restrict',
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
                'plan_states',
                ['fk_indicateurs_logement'],
                {
                    type: 'foreign key',
                    name: 'fk_plan_states_indicateurs_logement',
                    references: {
                        table: 'indicateurs_logement',
                        field: 'indicateurs_logement_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'restrict',
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
                'plan_states',
                ['fk_indicateurs_formation'],
                {
                    type: 'foreign key',
                    name: 'fk_plan_states_indicateurs_formation',
                    references: {
                        table: 'indicateurs_formation',
                        field: 'indicateurs_formation_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'restrict',
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
                'plan_states',
                ['fk_indicateurs_education'],
                {
                    type: 'foreign key',
                    name: 'fk_plan_states_indicateurs_education',
                    references: {
                        table: 'indicateurs_education',
                        field: 'indicateurs_education_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'restrict',
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
                'plan_states',
                ['fk_indicateurs_securisation'],
                {
                    type: 'foreign key',
                    name: 'fk_plan_states_indicateurs_securisation',
                    references: {
                        table: 'indicateurs_securisation',
                        field: 'indicateurs_securisation_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'restrict',
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
                'plan_states',
                ['created_by'],
                {
                    type: 'foreign key',
                    name: 'fk_plan_states_creator',
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
                'plan_states',
                ['updated_by'],
                {
                    type: 'foreign key',
                    name: 'fk_plan_states_editor',
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
            'plan_states',
            'uk_plan_states_date_unicity',
            {
                transaction,
            },
        )
            .then(() => queryInterface.removeConstraint(
                'plan_states',
                'fk_plan_states_plan',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeConstraint(
                'plan_states',
                'fk_plan_states_audience_in',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeConstraint(
                'plan_states',
                'fk_plan_states_audience_out_positive',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeConstraint(
                'plan_states',
                'fk_plan_states_audience_out_abandoned',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeConstraint(
                'plan_states',
                'fk_plan_states_audience_out_excluded',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeConstraint(
                'plan_states',
                'fk_plan_states_indicateurs_commun',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeConstraint(
                'plan_states',
                'fk_plan_states_indicateurs_sante',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeConstraint(
                'plan_states',
                'fk_plan_states_indicateurs_logement',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeConstraint(
                'plan_states',
                'fk_plan_states_indicateurs_formation',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeConstraint(
                'plan_states',
                'fk_plan_states_indicateurs_education',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeConstraint(
                'plan_states',
                'fk_plan_states_indicateurs_securisation',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeConstraint(
                'plan_states',
                'fk_plan_states_creator',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeConstraint(
                'plan_states',
                'fk_plan_states_editor',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.dropTable('plan_states', { transaction })),
    ),

};
