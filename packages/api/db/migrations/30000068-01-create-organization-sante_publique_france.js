module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            const [{ organization_type_id }] = await queryInterface.sequelize.query(
                'SELECT organization_type_id FROM organization_types WHERE uid = \'agence_nationale\'',
                {
                    type: queryInterface.sequelize.QueryTypes.SELECT,
                    transaction,
                },
            );

            await queryInterface.bulkInsert(
                'organizations',
                [{
                    name: 'Santé publique France',
                    abbreviation: null,
                    active: true,
                    fk_type: organization_type_id,
                    being_funded: false,
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
                'DELETE FROM organizations WHERE name = \'Santé publique France\'',
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
