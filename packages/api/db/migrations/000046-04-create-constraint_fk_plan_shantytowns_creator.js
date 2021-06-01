module.exports = {

    up: queryInterface => queryInterface.addConstraint(
        'plan_shantytowns',
        ['created_by'], {
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

    down: queryInterface => queryInterface.removeConstraint(
        'plan_shantytowns',
        'fk_plan_shantytowns_creator',
    ),

};
