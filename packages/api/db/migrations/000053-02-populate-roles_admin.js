/* eslint-disable key-spacing */

module.exports = {

    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.bulkInsert(
            'roles_admin',
            [
                {
                    role_id:    'local_admin',
                    name:       'Administrateur local',
                },
                {
                    role_id:    'national_admin',
                    name:       'Administrateur national',
                },
            ],
            {
                transaction,
            },
        ),
    ),

    down: queryInterface => queryInterface.bulkDelete('roles_admin'),

};
