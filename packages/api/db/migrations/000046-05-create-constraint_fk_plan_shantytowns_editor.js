module.exports = {

    up: queryInterface => queryInterface.addConstraint(
        'plan_shantytowns',
        ['updated_by'], {
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

    down: queryInterface => queryInterface.removeConstraint(
        'plan_shantytowns',
        'fk_plan_shantytowns_editor',
    ),

};
