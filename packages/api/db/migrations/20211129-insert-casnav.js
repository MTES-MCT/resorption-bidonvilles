
module.exports = {
    up: queryInterface => queryInterface.sequelize.transaction(
        Promise.all([
            queryInterface.sequelize.query(
                'SELECT organization_type_id FROM organization_types WHERE uid = \'casnav\'',
                { type: queryInterface.sequelize.QueryTypes.SELECT },
            ),
            queryInterface.sequelize.query(
                'SELECT * FROM regions WHERE code NOT IN (SELECT region_code FROM localized_organizations WHERE abbreviation LIKE \'CASNAV%\')',
                { type: queryInterface.sequelize.QueryTypes.SELECT },
            ),
        ])
            .then(([[{ organization_type_id }], regions]) => queryInterface.bulkInsert(
                'organizations',
                regions.map(({ code, name }) => ({
                    name: `Centre Académique pour la Scolarisation des Nouveaux Arrivants et des enfants du Voyage - ${name}`,
                    abbreviation: `CASNAV - ${name}`,
                    active: true,
                    fk_type: organization_type_id,
                    fk_region: code,
                })),
            ))
            .then(() => queryInterface.sequelize.query(
                'REFRESH MATERIALIZED VIEW localized_organizations',
            )),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            'DELETE FROM organizations WHERE abbreviation LIKE \'CASNAV%\'',
            {
                transaction,
            },
        )
            .then(() => queryInterface.sequelize.query(
                'REFRESH MATERIALIZED VIEW localized_organizations',
                { transaction },
            )),

    ),
};
