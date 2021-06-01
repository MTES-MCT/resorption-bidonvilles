/* eslint-disable key-spacing */

module.exports = {

    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.bulkInsert(
            'roles_regular',
            [
                {
                    role_id:    'collaborator',
                    name:       'Partenaire institutionnel',
                },
                {
                    role_id:    'association',
                    name:       'Opérateur',
                },
                {
                    role_id:    'national_establisment',
                    name:       'Acteur national',
                },
                {
                    role_id:    'direct_collaborator',
                    name:       'Correspondant',
                },
            ],
            {
                transaction,
            },
        ),
    ),

    down: queryInterface => queryInterface.bulkDelete('roles_regular'),

};
