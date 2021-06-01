module.exports = {

    up: queryInterface => queryInterface.addConstraint(
        'plan_fundings',
        ['fk_type'],
        {
            type: 'foreign key',
            name: 'fk_plan_fundings_type',
            references: {
                table: 'funding_types',
                field: 'funding_type_id',
            },
            onUpdate: 'cascade',
            onDelete: 'restrict',
        },
    ),

    down: queryInterface => queryInterface.removeConstraint(
        'plan_fundings',
        'fk_plan_fundings_type',
    ),

};
