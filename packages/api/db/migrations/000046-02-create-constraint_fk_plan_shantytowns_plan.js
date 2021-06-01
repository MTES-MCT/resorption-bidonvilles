module.exports = {

    up: queryInterface => queryInterface.addConstraint(
        'plan_shantytowns',
        ['fk_plan'],
        {
            type: 'foreign key',
            name: 'fk_plan_shantytowns_plan',
            references: {
                table: 'plans',
                field: 'plan_id',
            },
            onUpdate: 'cascade',
            onDelete: 'cascade',
        },
    ),

    down: queryInterface => queryInterface.removeConstraint(
        'plan_shantytowns',
        'fk_plan_shantytowns_plan',
    ),

};
