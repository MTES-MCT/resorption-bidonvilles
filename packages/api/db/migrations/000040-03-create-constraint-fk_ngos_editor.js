module.exports = {

    up: queryInterface => queryInterface.addConstraint(
        'ngos',
        ['updated_by'], {
            type: 'foreign key',
            name: 'fk_ngos_editor',
            references: {
                table: 'users',
                field: 'user_id',
            },
            onUpdate: 'cascade',
            onDelete: 'restrict',
        },
    ),

    down: queryInterface => queryInterface.removeConstraint(
        'ngos',
        'fk_ngos_editor',
    ),

};
