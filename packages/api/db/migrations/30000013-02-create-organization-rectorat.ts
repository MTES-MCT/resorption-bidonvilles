module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        const [
            [[{ organization_type_id }]],
            academies,
        ] = await Promise.all([
            queryInterface.sequelize.query(
                `INSERT INTO organization_types(uid, name_singular, name_plural, fk_category, fk_role)
                VALUES ('rectorat', 'Rectorat', 'Rectorats', 'public_establishment', 'collaborator')
                RETURNING organization_type_id`,
                {
                    transaction,
                },
            ),
            queryInterface.sequelize.query(
                `SELECT name, particle, departement FROM (
                    SELECT
                        academies.name,
                        academies.particle,
                        departements.code AS departement,
                        ROW_NUMBER() OVER(PARTITION BY departements.fk_academie) AS position
                    FROM academies
                    LEFT JOIN departements ON departements.fk_academie = academies.uid
                ) t
                WHERE t.position = 1`,
                {
                    type: queryInterface.sequelize.QueryTypes.SELECT,
                    transaction,
                },
            ),
        ]);

        await queryInterface.bulkInsert(
            'organizations',
            academies.map(({ name, particle, departement }) => ({
                name: `Rectorat - Académie ${particle}${name}`,
                active: true,
                fk_type: organization_type_id,
                fk_departement: departement,
                being_funded: false,
            })),
            { transaction },
        );

        await queryInterface.sequelize.query(
            'REFRESH MATERIALIZED VIEW localized_organizations',
            { transaction },
        );
        return transaction.commit();
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        const [{ organization_type_id }] = await queryInterface.sequelize.query(
            'SELECT organization_type_id FROM organization_types WHERE uid = \'rectorat\'',
            {
                type: queryInterface.sequelize.QueryTypes.SELECT,
                transaction,
            },
        );
        await queryInterface.sequelize.query(
            'DELETE FROM organizations WHERE fk_type = :organization_type_id',
            {
                transaction,
                replacements: {
                    organization_type_id,
                },
            },
        );
        await queryInterface.sequelize.query(
            'REFRESH MATERIALIZED VIEW localized_organizations',
            { transaction },
        );
        await queryInterface.sequelize.query(
            'DELETE FROM organization_types WHERE organization_type_id = :organization_type_id',
            {
                transaction,
                replacements: {
                    organization_type_id,
                },
            },
        );

        return transaction.commit();
    },
};
