/* eslint-disable key-spacing */

module.exports = {

    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.bulkInsert(
            'organization_categories',
            [
                {
                    uid:            'public_establishment',
                    name_singular:  'Service de l\'État, établissement ou organisme public',
                    name_plural:    'Services de l\'État, établissements et organismes publics',
                },
                {
                    uid:            'territorial_collectivity',
                    name_singular:  'Collectivité territoriale',
                    name_plural:    'Collectivités territoriales',
                },
                {
                    uid:            'association',
                    name_singular:  'Association',
                    name_plural:    'Associations',
                },
                {
                    uid:            'administration',
                    name_singular:  'Administration centrale',
                    name_plural:    'Administrations centrales',
                },
            ],
            {
                transaction,
            },
        ),
    ),

    down: queryInterface => queryInterface.bulkDelete('organization_categories'),

};
