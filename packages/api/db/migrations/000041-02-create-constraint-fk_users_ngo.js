module.exports = {

    up: queryInterface => queryInterface.addConstraint(
        'users',
        ['fk_ngo'],
        {
            type: 'foreign key',
            name: 'fk_users_ngo',
            references: {
                table: 'ngos',
                field: 'ngo_id',
            },
            onUpdate: 'cascade',
            onDelete: 'restrict',
        },
    ),

    down: queryInterface => queryInterface.removeConstraint(
        'users',
        'fk_users_ngo',
    ),

};
