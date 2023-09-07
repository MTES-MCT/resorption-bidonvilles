module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        const [[{ organization_type_id }]] = await queryInterface.sequelize.query(
            `INSERT INTO organization_types(
                name_singular,
                name_plural,
                abbreviation,
                fk_category,
                fk_role,
                uid
            )
            VALUES (
                'Établissement public de santé',
                'Établissements publics de santé',
                NULL,
                'public_establishment',
                'collaborator',
                'etablissement_public_sante'
            )
            RETURNING organization_type_id`,
            {
                transaction,
            },
        );

        await queryInterface.bulkInsert(
            'organizations',
            [{
                name: 'Assistance publique - Hôpitaux de Paris',
                abbreviation: 'AP-HP',
                active: true,
                fk_type: organization_type_id,
                fk_region: '11',
            }],
            {
                transaction,
            },
        );
        await queryInterface.sequelize.query(
            'REFRESH MATERIALIZED VIEW localized_organizations',
            {
                transaction,
            },
        );

        return transaction.commit();
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();
        const [{ organization_type_id }] = await queryInterface.sequelize.query(
            'SELECT organization_type_id FROM organization_types WHERE uid = \'etablissement_public_sante\'',
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
            'DELETE FROM organization_types WHERE organization_type_id = :organization_type_id',
            {
                transaction,
                replacements: {
                    organization_type_id,
                },
            },
        );

        await queryInterface.sequelize.query(
            'REFRESH MATERIALIZED VIEW localized_organizations',
            {
                transaction,
            },
        );

        return transaction.commit();
    },
};
