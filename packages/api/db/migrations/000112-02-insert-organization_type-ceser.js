module.exports = {
    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => Promise.all([
            queryInterface.sequelize.query(
                `INSERT INTO organization_types(
                    name_singular,
                    name_plural,
                    abbreviation,
                    fk_category,
                    fk_role
                )
                VALUES (
                    'Conseil économique, social et environnemental régional',
                    'Conseils économiques, sociaux et environnementaux régionaux',
                    'CESER',
                    'territorial_collectivity',
                    'collaborator'
                )
                RETURNING organization_type_id`,
                {
                    transaction,
                },
            ),
            queryInterface.sequelize.query(
                'SELECT code, name FROM regions',
                {
                    type: queryInterface.sequelize.QueryTypes.SELECT,
                    transaction,
                },
            ),
        ])
            .then(([[[{ organization_type_id }]], regions]) => queryInterface.bulkInsert(
                'organizations',
                regions.map(({ code, name }) => ({
                    name: `Conseil économique, social et environnemental régional - ${name}`,
                    abbreviation: `CESER - ${name}`,
                    active: true,
                    fk_type: organization_type_id,
                    fk_region: code,
                })),
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.sequelize.query(
                'REFRESH MATERIALIZED VIEW localized_organizations',
                {
                    transaction,
                },
            )),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            'DELETE FROM organizations WHERE abbreviation ILIKE \'CESER - %\'',
            {
                transaction,
            },
        )
            .then(() => queryInterface.sequelize.query(
                'DELETE FROM organization_types WHERE abbreviation = \'CESER\'',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.sequelize.query(
                'REFRESH MATERIALIZED VIEW localized_organizations',
                {
                    transaction,
                },
            )),
    ),
};
