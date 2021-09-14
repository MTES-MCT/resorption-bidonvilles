module.exports = {
    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            `UPDATE organizations
             SET
               name = REPLACE(name, 'Direction Régionale de l''Emploi, du Travail et des Solidarités', 'Direction Régionale de l''Économie, de l''Emploi, du Travail et des Solidarités'),  
               abbreviation = REPLACE (abbreviation, 'DRETS', 'DREETS')
             WHERE fk_type = (SELECT organization_type_id FROM organization_types WHERE uid = 'drets')
             `,
            {
                transaction,
            },
        ).then(() => queryInterface.sequelize.query(
            `UPDATE organization_types
             SET 
                name_singular = 'Direction Régionale de l''Économie, de l''Emploi, du Travail et des Solidarités',
                name_plural = 'Directions Régionales de l''Économie, de l''Emploi, du Travail et des Solidarités',
                abbreviation = 'DREETS',
                uid = 'dreets'
             WHERE uid = 'drets'`,
            {
                transaction,
            },
        ))

            .then(() => queryInterface.sequelize.query('REFRESH MATERIALIZED VIEW localized_organizations', {
                transaction,
            })),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            `UPDATE organizations
             SET
                name = REPLACE(name, 'Direction Régionale de l''Économie, de l''Emploi, du Travail et des Solidarités', 'Direction Régionale de l''Emploi, du Travail et des Solidarités'),  
                abbreviation = REPLACE (abbreviation, 'DREETS', 'DRETS')
             WHERE fk_type = (SELECT organization_type_id FROM organization_types WHERE uid = 'dreets')`,
            {
                transaction,
            },
        ).then(() => queryInterface.sequelize.query(
            `UPDATE organization_types
             SET 
                name_singular = 'Direction Régionale de l''Emploi, du Travail et des Solidarités',
                name_plural = 'Direction Régionale de l''Emploi, du Travail et des Solidarités',
                abbreviation = 'DRETS',
                uid = 'drets'
             WHERE uid = 'dreets'`,
            {
                transaction,
            },
        ))

            .then(() => queryInterface.sequelize.query('REFRESH MATERIALIZED VIEW localized_organizations', {
                transaction,
            })),
    ),
};
