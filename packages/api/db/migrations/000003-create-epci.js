module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable(
        'epci',
        {
            code: {
                type: Sequelize.STRING(9),
                allowNull: false,
                primaryKey: true,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            fk_departement: {
                type: Sequelize.STRING(3),
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
        .then(() => queryInterface.addConstraint('epci', ['fk_departement'], {
            type: 'foreign key',
            name: 'fk_epci_departement',
            references: {
                table: 'departements',
                field: 'code',
            },
            onUpdate: 'cascade',
            onDelete: 'restrict',
        })),

    down: queryInterface => queryInterface.dropTable('epci'),
};
