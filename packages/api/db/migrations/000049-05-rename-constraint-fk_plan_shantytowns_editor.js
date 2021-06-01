module.exports = {

    up: queryInterface => Promise.all([
        queryInterface.removeConstraint(
            'plan_details',
            'fk_plan_shantytowns_editor',
        ),
        queryInterface.addConstraint(
            'plan_details',
            ['updated_by'],
            {
                type: 'foreign key',
                name: 'fk_plan_details_editor',
                references: {
                    table: 'users',
                    field: 'user_id',
                },
                onUpdate: 'cascade',
                onDelete: 'restrict',
            },
        ),
    ]),

    down: queryInterface => Promise.all([
        queryInterface.removeConstraint(
            'plan_details',
            'fk_plan_details_editor',
        ),
        queryInterface.addConstraint(
            'plan_details',
            ['updated_by'],
            {
                type: 'foreign key',
                name: 'fk_plan_shantytowns_editor',
                references: {
                    table: 'users',
                    field: 'user_id',
                },
                onUpdate: 'cascade',
                onDelete: 'restrict',
            },
        ),
    ]),

};
