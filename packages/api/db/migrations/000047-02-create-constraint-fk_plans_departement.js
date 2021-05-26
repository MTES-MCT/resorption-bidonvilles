module.exports = {

    up: queryInterface => queryInterface.addConstraint(
        'plans',
        ['fk_departement'],
        {
            type: 'foreign key',
            name: 'fk_plans_departement',
            references: {
                table: 'departements',
                field: 'code',
            },
            onUpdate: 'cascade',
            onDelete: 'restrict',
        },
    ),

    down: queryInterface => queryInterface.removeConstraint(
        'plans',
        'fk_plans_departement',
    ),

};
