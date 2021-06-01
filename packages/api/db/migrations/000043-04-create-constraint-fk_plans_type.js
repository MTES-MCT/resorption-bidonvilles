module.exports = {

    up: queryInterface => queryInterface.addConstraint(
        'plans',
        ['fk_type'],
        {
            type: 'foreign key',
            name: 'fk_plans_type',
            references: {
                table: 'plan_types',
                field: 'plan_type_id',
            },
            onUpdate: 'cascade',
            onDelete: 'restrict',
        },
    ),

    down: queryInterface => queryInterface.removeConstraint(
        'plans',
        'fk_plans_type',
    ),

};
