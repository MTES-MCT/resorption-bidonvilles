module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        const [
            [[{ organization_type_id }]],
            departements,
        ] = await Promise.all([
            queryInterface.sequelize.query(
                `INSERT INTO organization_types(uid, name_singular, name_plural, fk_category, fk_role)
                VALUES ('pole_emploi', 'Pôle Emploi', 'Pôle Emploi', 'public_establishment', 'collaborator')
                RETURNING organization_type_id`,
                {
                    transaction,
                },
            ),
            queryInterface.sequelize.query(
                'SELECT code, name FROM departements',
                {
                    type: queryInterface.sequelize.QueryTypes.SELECT,
                    transaction,
                },
            ),
        ]);

        await queryInterface.bulkInsert(
            'organizations',
            departements.map(({ code, name }) => ({
                name: `Pôle Emploi - ${name}`,
                active: true,
                fk_type: organization_type_id,
                fk_departement: code,
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

        const [{ organization_type_id }] = queryInterface.sequelize.query(
            'SELECT organization_type_id FROM organization_types WHERE uid = \'pole_emploi\'',
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
            'DELETE FROM organization_types WHERE uid = \'pole_emploi\'',
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
