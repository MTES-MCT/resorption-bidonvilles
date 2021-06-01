module.exports = {
    up: (queryInterface, Sequelize) => Promise.all([
        queryInterface.addColumn(
            'cities',
            'fk_main',
            {
                type: Sequelize.STRING(5),
                allowNull: true,
            },
        ),
    ])
        .then(() => queryInterface.addConstraint('cities', ['fk_main'], {
            type: 'foreign key',
            name: 'fk_cities_main',
            references: {
                table: 'cities',
                field: 'code',
            },
            onUpdate: 'cascade',
            onDelete: 'restrict',
        })),

    down: queryInterface => queryInterface.removeConstraint('cities', 'fk_cities_main')
        .then(() => queryInterface.removeColumn('cities', 'fk_main')),

};
