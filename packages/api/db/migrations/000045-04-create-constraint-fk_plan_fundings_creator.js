module.exports = {

    up: queryInterface => queryInterface.addConstraint(
        'plan_fundings',
        ['created_by'], {
            type: 'foreign key',
            name: 'fk_plan_fundings_creator',
            references: {
                table: 'users',
                field: 'user_id',
            },
            onUpdate: 'cascade',
            onDelete: 'restrict',
        },
    ),

    down: queryInterface => queryInterface.removeConstraint(
        'plan_fundings',
        'fk_plan_fundings_creator',
    ),

};
