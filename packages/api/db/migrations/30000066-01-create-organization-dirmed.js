module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await queryInterface.bulkInsert(
                'organization_types',
                [{
                    name_singular: 'Direction interdépartementale des routes',
                    name_plural: 'Directions interdépartementales des routes ',
                    fk_category: 'public_establishment',
                    fk_role: 'collaborator',
                    uid: 'direction_des_routes',
                }],
                { transaction },
            );
            const [{ organization_type_id }] = await queryInterface.sequelize.query(
                'SELECT organization_type_id FROM organization_types WHERE uid = \'direction_des_routes\'',
                {
                    type: queryInterface.sequelize.QueryTypes.SELECT,
                    transaction,
                },
            );

            await queryInterface.bulkInsert(
                'organizations',
                [{
                    name: 'Direction interdépartementale des routes — Méditerranée',
                    abbreviation: 'DIRMED',
                    active: true,
                    fk_type: organization_type_id,
                    being_funded: false,
                    fk_region: '93',
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
                'DELETE FROM organizations WHERE name = \'Direction interdépartementale des routes — Méditerranée\'',
                {
                    transaction,
                },
            );
            await queryInterface.sequelize.query(
                'DELETE FROM organization_types WHERE uid = \'direction_des_routes\'',
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
