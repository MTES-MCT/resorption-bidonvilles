module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.createTable(
            'organization_types',
            {
                organization_type_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                },
                name_singular: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                name_plural: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                abbreviation: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                fk_category: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                fk_role: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                created_at: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
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
            'organization_types',
            ['fk_category'],
            {
                type: 'foreign key',
                name: 'fk_organization_types_category',
                references: {
                    table: 'organization_categories',
                    field: 'uid',
                },
                onUpdate: 'cascade',
                onDelete: 'restrict',
                transaction,
            },
        )).then(() => queryInterface.addConstraint(
            'organization_types',
            ['fk_role'],
            {
                type: 'foreign key',
                name: 'fk_organization_types_role',
                references: {
                    table: 'roles_regular',
                    field: 'role_id',
                },
                onUpdate: 'cascade',
                onDelete: 'restrict',
                transaction,
            },
        )),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.removeConstraint(
            'organization_types',
            'fk_organization_types_category',
            {
                transaction,
            },
        )
            .then(() => queryInterface.removeConstraint(
                'organization_types',
                'fk_organization_types_role',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.dropTable('organization_types', { transaction })),
    ),

};
