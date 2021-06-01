module.exports = {

    up: queryInterface => queryInterface.addConstraint(
        'plans',
        ['updated_by'], {
            type: 'foreign key',
            name: 'fk_plans_editor',
            references: {
                table: 'users',
                field: 'user_id',
            },
            onUpdate: 'cascade',
            onDelete: 'restrict',
        },
    ),

    down: queryInterface => queryInterface.removeConstraint(
        'plans',
        'fk_plans_editor',
    ),

};
