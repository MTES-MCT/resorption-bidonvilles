module.exports = {

    up: queryInterface => queryInterface.addConstraint(
        'ngos',
        ['created_by'], {
            type: 'foreign key',
            name: 'fk_ngos_creator',
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
        'fk_ngos_creator',
    ),

};
