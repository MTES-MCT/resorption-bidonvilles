module.exports = {

    up: queryInterface => Promise.all([
        queryInterface.removeConstraint(
            'plan_details',
            'fk_plan_shantytowns_town',
        ),
        queryInterface.addConstraint(
            'plan_details',
            ['fk_shantytown'],
            {
                type: 'foreign key',
                name: 'fk_plan_details_town',
                references: {
                    table: 'shantytowns',
                    field: 'shantytown_id',
                },
                onUpdate: 'cascade',
                onDelete: 'cascade',
            },
        ),
    ]),

    down: queryInterface => Promise.all([
        queryInterface.removeConstraint(
            'plan_details',
            'fk_plan_details_town',
        ),
        queryInterface.addConstraint(
            'plan_details',
            ['fk_shantytown'],
            {
                type: 'foreign key',
                name: 'fk_plan_shantytowns_town',
                references: {
                    table: 'shantytowns',
                    field: 'shantytown_id',
                },
                onUpdate: 'cascade',
                onDelete: 'cascade',
            },
        ),
    ]),

};
