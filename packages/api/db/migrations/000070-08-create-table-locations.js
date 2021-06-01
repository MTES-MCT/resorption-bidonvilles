module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.createTable(
            'locations',
            {
                location_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                },
                address: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                latitude: {
                    type: Sequelize.DOUBLE,
                    allowNull: false,
                },
                longitude: {
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
            'locations',
            ['created_by'],
            {
                type: 'foreign key',
                name: 'fk_locations_creator',
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
                'locations',
                ['updated_by'],
                {
                    type: 'foreign key',
                    name: 'fk_locations_editor',
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
            'locations',
            'fk_locations_creator',
            {
                transaction,
            },
        )
            .then(() => queryInterface.removeConstraint(
                'locations',
                'fk_locations_editor',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.dropTable('locations', { transaction })),
    ),

};
