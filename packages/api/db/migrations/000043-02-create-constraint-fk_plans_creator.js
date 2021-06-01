module.exports = {

    up: queryInterface => queryInterface.addConstraint(
        'plans',
        ['created_by'], {
            type: 'foreign key',
            name: 'fk_plans_creator',
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
        'fk_plans_creator',
    ),

};
