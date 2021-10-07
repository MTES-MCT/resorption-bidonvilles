module.exports = {
    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            `INSERT INTO organization_types(name_singular, name_plural, fk_category, fk_role, uid)
            VALUES ('Assemblée nationale', 'Assemblée nationale', 'public_establishment', 'collaborator', 'assemblee_nationale')
            RETURNING organization_type_id`,
            {
                transaction,
            },
        )
            .then(([[{ organization_type_id }]]) => queryInterface.sequelize.query(
                'SELECT * FROM departements',
                { type: queryInterface.sequelize.QueryTypes.SELECT, transaction },
            )
                .then(departements => ({
                    organization_type_id,
                    departements,
                })))
            .then(({ organization_type_id, departements }) => queryInterface.bulkInsert(
                'organizations',
                departements.map(({ code, name }) => ({
                    name: `Assemblée nationale - ${name}`,
                    active: false,
                    fk_type: organization_type_id,
                    fk_departement: code,
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
            'SELECT organization_type_id FROM organization_types WHERE uid = \'assemblee_nationale\'',
            { type: queryInterface.sequelize.QueryTypes.SELECT, transaction },
        )
            .then(([{ organization_type_id }]) => queryInterface.sequelize.query(
                'DELETE FROM organizations WHERE fk_type = :id',
                {
                    replacements: {
                        id: organization_type_id,
                    },
                    transaction,
                },
            ))
            .then(() => queryInterface.sequelize.query(
                'REFRESH MATERIALIZED VIEW localized_organizations',
                { transaction },
            ))
            .then(() => queryInterface.sequelize.query(
                'DELETE FROM organization_types WHERE uid = \'assemblee_nationale\'',
                { transaction },
            )),
    ),
};
