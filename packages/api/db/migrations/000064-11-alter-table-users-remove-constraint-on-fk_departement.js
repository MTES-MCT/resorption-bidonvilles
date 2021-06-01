/**
 * Please note this migration is useful for down migrations only:
 * it ensures that if fk_departement is restored (ie. added back to users), then the column
 * has been populated manually before adding the NOT NULL and foreign key constraints
 *
 * The expected behavior is:
 * 1. you try to undo migration b-remove-fk_departement:
 *      => it succeeds and fk_departement is added to users without constraints
 * 2. you try to undo migration a-remove-fk_departement:
 *      => it fails because the column contains NULL values
 * 3. you are now reminded and forced to populate users.fk_departement in an acceptable way
 */
module.exports = {

    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.removeConstraint(
            'users',
            'fk_user_departement',
            {
                transaction,
            },
        ),
    ),

    down: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.changeColumn(
            'users',
            'fk_departement',
            {
                type: Sequelize.STRING,
                allowNull: false,
            },
        )
            .then(() => queryInterface.addConstraint(
                'users',
                ['fk_departement'],
                {
                    type: 'foreign key',
                    name: 'fk_user_departement',
                    references: {
                        table: 'departements',
                        field: 'code',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'restrict',
                    transaction,
                },
            )),
    ),

};
