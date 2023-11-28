module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            const [{ organization_type_id }] = await queryInterface.sequelize.query(
                'SELECT organization_type_id FROM organization_types WHERE uid = \'organisme_prive\'',
                {
                    type: queryInterface.sequelize.QueryTypes.SELECT,
                    transaction,
                },
            );
            await queryInterface.bulkInsert(
                'organizations',
                [{
                    name: 'Abdul Latif Jameel Poverty Action Lab',
                    abbreviation: 'J-PAL',
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
                'DELETE FROM organizations WHERE name = \'Abdul Latif Jameel Poverty Action Lab\'',
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
