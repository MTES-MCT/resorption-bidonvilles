module.exports = {

    up: queryInterface => Promise.all([
        queryInterface.removeConstraint(
            'plan_details',
            'fk_plan_shantytowns_creator',
        ),
        queryInterface.addConstraint(
            'plan_details',
            ['created_by'],
            {
                type: 'foreign key',
                name: 'fk_plan_details_creator',
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
            'fk_plan_details_creator',
        ),
        queryInterface.addConstraint(
            'plan_details',
            ['created_by'],
            {
                type: 'foreign key',
                name: 'fk_plan_shantytowns_creator',
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
