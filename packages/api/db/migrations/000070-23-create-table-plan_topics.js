module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.createTable(
            'plan_topics',
            {
                fk_plan: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                fk_topic: {
                    type: Sequelize.STRING,
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
            'plan_topics',
            ['fk_plan'],
            {
                type: 'foreign key',
                name: 'fk_plan_topics_plan',
                references: {
                    table: 'plans2',
                    field: 'plan_id',
                },
                onUpdate: 'cascade',
                onDelete: 'cascade',
                transaction,
            },
        )).then(() => queryInterface.addConstraint(
            'plan_topics',
            ['fk_topic'],
            {
                type: 'foreign key',
                name: 'fk_plan_topics_topic',
                references: {
                    table: 'topics',
                    field: 'uid',
                },
                onUpdate: 'cascade',
                onDelete: 'cascade',
                transaction,
            },
        ))
            .then(() => queryInterface.addConstraint(
                'plan_topics',
                ['created_by'],
                {
                    type: 'foreign key',
                    name: 'fk_plan_topics_creator',
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
                'plan_topics',
                ['updated_by'],
                {
                    type: 'foreign key',
                    name: 'fk_plan_topics_editor',
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
            'plan_topics',
            'fk_plan_topics_creator',
            {
                transaction,
            },
        )
            .then(() => queryInterface.removeConstraint(
                'plan_topics',
                'fk_plan_topics_editor',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeConstraint(
                'plan_topics',
                'fk_plan_topics_topic',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeConstraint(
                'plan_topics',
                'fk_plan_topics_plan',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.dropTable('plan_topics', { transaction })),
    ),

};
