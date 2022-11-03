module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        const [[[{ organization_type_id }]], departements] = await Promise.all([
            queryInterface.sequelize.query(
                `INSERT INTO organization_types(
                    name_singular,
                    name_plural,
                    abbreviation,
                    fk_category,
                    fk_role,
                    uid
                )
                VALUES (
                    'Gendarmerie départementale',
                    'Gendarmeries départementales',
                    NULL,
                    'public_establishment',
                    'collaborator',
                    'gendarmerie_departementale'
                )
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
                name: `Gendarmerie - ${name}`,
                abbreviation: null,
                active: true,
                fk_type: organization_type_id,
                fk_departement: code,
            })),
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
            'SELECT organization_type_id FROM organization_types WHERE uid = \'gendarmerie_departementale\'',
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
