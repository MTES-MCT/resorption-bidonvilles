/* eslint-disable key-spacing */
module.exports = {

    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.bulkInsert(
            'organization_types',
            [
                {
                    abbreviation:   'DRETS',
                    name_singular:  'Direction Régionale de l\'Emploi, du Travail et des Solidarités',
                    name_plural:    'Directions Régionales de l\'Emploi, du Travail et des Solidarités',
                    fk_category:    'public_establishment',
                    fk_role:        'direct_collaborator',
                },
                {
                    abbreviation:   'DDETS',
                    name_singular:  'Direction Départementale de l\'Emploi, du Travail et des Solidarités',
                    name_plural:    'Directions Départementales de l\'Emploi, du Travail et des Solidarités',
                    fk_category:    'public_establishment',
                    fk_role:        'direct_collaborator',
                },
            ],
            {
                transaction,
            },
        ),
    ),
    down: queryInterface => queryInterface.sequelize.query('DELETE FROM organization_types where abbreviation IN (\'DRETS\', \'DDETS\')'),
};
