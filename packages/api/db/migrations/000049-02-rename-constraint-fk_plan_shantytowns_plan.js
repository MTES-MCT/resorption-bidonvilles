module.exports = {

    up: queryInterface => Promise.all([
        queryInterface.removeConstraint(
            'plan_details',
            'fk_plan_shantytowns_plan',
        ),
        queryInterface.addConstraint(
            'plan_details',
            ['fk_plan'],
            {
                type: 'foreign key',
                name: 'fk_plan_details_plan',
                references: {
                    table: 'plans',
                    field: 'plan_id',
                },
                onUpdate: 'cascade',
                onDelete: 'cascade',
            },
        ),
    ]),

    down: queryInterface => Promise.all([
        queryInterface.removeConstraint(
            'plan_details',
            'fk_plan_details_plan',
        ),
        queryInterface.addConstraint(
            'plan_details',
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
    ]),

};
