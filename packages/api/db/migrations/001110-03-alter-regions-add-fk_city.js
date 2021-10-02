module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.addColumn(
            'regions',
            'fk_city',
            {
                type: Sequelize.STRING(5),
                allowNull: true,
            },
            {
                transaction,
            },
        )
            .then(() => queryInterface.addConstraint(
                'regions',
                ['fk_city'],
                {
                    type: 'foreign key',
                    name: 'fk_regions_cheflieu',
                    references: {
                        table: 'cities',
                        field: 'code',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'restrict',
                    transaction,
                },
            )),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.removeConstraint(
            'regions',
            'fk_regions_cheflieu',
            { transaction },
        )
            .then(() => queryInterface.removeColumn(
                'regions',
                'fk_city',
                {
                    transaction,
                },
            )),
    ),

};
