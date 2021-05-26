module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.createTable(
            'features',
            {
                name: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    primaryKey: true,
                },
                fk_entity: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    primaryKey: true,
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
            'features',
            ['fk_entity'],
            {
                type: 'foreign key',
                name: 'fk_features_entity',
                references: {
                    table: 'entities',
                    field: 'name',
                },
                onUpdate: 'cascade',
                onDelete: 'restrict',
                transaction,
            },
        )),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.removeConstraint(
            'features',
            'fk_features_entity',
            {
                transaction,
            },
        )
            .then(() => queryInterface.dropTable('features', { transaction })),
    ),

};
