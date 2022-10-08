module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.createTable(
            'plans2',
            {
                plan_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                },
                name: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                started_at: {
                    type: Sequelize.DATEONLY,
                    allowNull: false,
                },
                expected_to_end_at: {
                    type: Sequelize.DATEONLY,
                    allowNull: true,
                },
                in_and_out: {
                    type: Sequelize.BOOLEAN,
                    allowNull: false,
                },
                goals: {
                    type: Sequelize.TEXT,
                    allowNull: false,
                },
                fk_category: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                location_type: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                location_details: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                fk_location: {
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
        ).then(() => queryInterface.addConstraint(
            'plans2', {
            fields: ['fk_category'],
                type: 'foreign key',
                name: 'fk_plans_category',
                references: {
                    table: 'plan_categories',
                    field: 'uid',
                },
                onUpdate: 'cascade',
                onDelete: 'restrict',
                transaction,
            },
        )).then(() => queryInterface.addConstraint(
            'plans2', {
            fields: ['fk_location'],
                type: 'foreign key',
                name: 'fk_plans_location',
                references: {
                    table: 'locations',
                    field: 'location_id',
                },
                onUpdate: 'cascade',
                onDelete: 'restrict',
                transaction,
            },
        ))
            .then(() => queryInterface.addConstraint(
            'plans2', {
            fields: ['created_by'],
                    type: 'foreign key',
                    name: 'fk_plans_creator',
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
            'plans2', {
            fields: ['updated_by'],
                    type: 'foreign key',
                    name: 'fk_plans_editor',
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
            'plans2',
            'fk_plans_category',
            {
                transaction,
            },
        )
            .then(() => queryInterface.removeConstraint(
                'plans2',
                'fk_plans_location',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeConstraint(
                'plans2',
                'fk_plans_creator',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeConstraint(
                'plans2',
                'fk_plans_editor',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.dropTable('plans2', { transaction })),
    ),

};
