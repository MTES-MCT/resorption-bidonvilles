module.exports = {

    up: queryInterface => queryInterface.addConstraint(
        'plan_fundings',
        ['fk_plan'],
        {
            type: 'foreign key',
            name: 'fk_plan_fundings_plan',
            references: {
                table: 'plans',
                field: 'plan_id',
            },
            onUpdate: 'cascade',
            onDelete: 'cascade',
        },
    ),

    down: queryInterface => queryInterface.removeConstraint(
        'plan_fundings',
        'fk_plan_fundings_plan',
    ),

};
