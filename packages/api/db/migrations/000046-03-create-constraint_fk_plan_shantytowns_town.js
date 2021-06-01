module.exports = {

    up: queryInterface => queryInterface.addConstraint(
        'plan_shantytowns',
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

    down: queryInterface => queryInterface.removeConstraint(
        'plan_shantytowns',
        'fk_plan_shantytowns_town',
    ),

};
