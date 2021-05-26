module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable(
        'cities',
        {
            code: {
                type: Sequelize.STRING(5),
                allowNull: false,
                primaryKey: true,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            fk_epci: {
                type: Sequelize.STRING(9),
                allowNull: false,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        },
    )
        .then(() => queryInterface.addConstraint('cities', ['fk_epci'], {
            type: 'foreign key',
            name: 'fk_cities_epci',
            references: {
                table: 'epci',
                field: 'code',
            },
            onUpdate: 'cascade',
            onDelete: 'restrict',
        })),

    down: queryInterface => queryInterface.dropTable('cities'),
};
