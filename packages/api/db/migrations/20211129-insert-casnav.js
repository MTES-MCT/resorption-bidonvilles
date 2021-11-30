
module.exports = {
    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            'select organization_type_id from organization_types where uid = \'casnav\'',
            { type: queryInterface.sequelize.QueryTypes.SELECT, transaction },
        )
            .then(([{ organization_type_id }]) => queryInterface.sequelize.query(
                'select * from regions where code not in (select region_code from localized_organizations where abbreviation ilike \'%CASNAV%\')',
                { type: queryInterface.sequelize.QueryTypes.SELECT, transaction },
            )
                .then(regions => ({
                    organization_type_id,
                    regions,
                })))
            .then(({ organization_type_id, regions }) => queryInterface.bulkInsert(
                'organizations',
                regions.map(({ code, name }) => ({
                    name: `Centre Académique pour la Scolarisation des Nouveaux Arrivants et des enfants du Voyage - ${name}`,
                    abbreviation: `CASNAV - ${name}`,
                    active: true,
                    fk_type: organization_type_id,
                    fk_region: code,
                })),
                { transaction },
            ))
            .then(() => queryInterface.sequelize.query(
                'REFRESH MATERIALIZED VIEW localized_organizations',
                { transaction },
            )),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            'delete from organizations where abbreviation ilike \'%CASNAV%\'',
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
