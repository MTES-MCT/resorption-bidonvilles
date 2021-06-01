module.exports = {

    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.removeConstraint(
            'users',
            'fk_users_ngo',
            {
                transaction,
            },
        )
            .then(() => queryInterface.removeColumn(
                'users',
                'fk_ngo',
                {
                    transaction,
                },
            )),
    ),

    down: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.addColumn(
            'users',
            'fk_ngo',
            {
                type: Sequelize.INTEGER,
                allowNull: true,
                defaultValue: null,
            },
            { transaction },
        )
            .then(() => queryInterface.addConstraint(
                'users',
                ['fk_ngo'],
                {
                    type: 'foreign key',
                    name: 'fk_users_ngo',
                    references: {
                        table: 'ngos',
                        field: 'ngo_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'restrict',
                    transaction,
                },
            )),
    ),

};
