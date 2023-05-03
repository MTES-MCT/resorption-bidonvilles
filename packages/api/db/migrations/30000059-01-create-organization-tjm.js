module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await queryInterface.bulkInsert(
                'organization_types',
                [{
                    name_singular: 'Tribunal judiciaire',
                    name_plural: 'Tribunaux judiciaires',
                    fk_category: 'public_establishment',
                    fk_role: 'direct_collaborator',
                    uid: 'tribunal_judiciaire',
                }],
                { transaction },
            );
            const [{ organization_type_id }] = await queryInterface.sequelize.query(
                'SELECT organization_type_id FROM organization_types WHERE uid = \'tribunal_judiciaire\'',
                {
                    type: queryInterface.sequelize.QueryTypes.SELECT,
                    transaction,
                },
            );
            await queryInterface.bulkInsert(
                'organizations',
                [{
                    name: 'Tribunal judiciaire de Marseille',
                    active: true,
                    fk_type: organization_type_id,
                    being_funded: false,
                    fk_departement: '13',
                }],
                { transaction },
            );

            await queryInterface.sequelize.query(
                'REFRESH MATERIALIZED VIEW localized_organizations',
                { transaction },
            );
            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await queryInterface.sequelize.query(
                'DELETE FROM organizations WHERE name = \'Tribunal judiciaire de Marseille\'',
                {
                    transaction,
                },
            );
            await queryInterface.sequelize.query(
                'DELETE FROM organization_types WHERE uid = \'tribunal_judiciaire\'',
                {
                    transaction,
                },
            );
            await queryInterface.sequelize.query(
                'REFRESH MATERIALIZED VIEW localized_organizations',
                { transaction },
            );

            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
