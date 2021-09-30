module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.addColumn(
            'departements',
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
                'departements',
                ['fk_city'],
                {
                    type: 'foreign key',
                    name: 'fk_departements_cheflieu',
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
            'departements',
            'fk_departements_cheflieu',
            { transaction },
        )
            .then(() => queryInterface.removeColumn(
                'departements',
                'fk_city',
                {
                    transaction,
                },
            )),
    ),

};
