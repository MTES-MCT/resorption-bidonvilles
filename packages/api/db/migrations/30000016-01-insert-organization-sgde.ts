module.exports = {
    async up(queryInterface) {
        const [[{ organization_type_id }]] = await queryInterface.sequelize.query(
            'SELECT organization_type_id FROM organization_types WHERE uid = \'organisme_prive\'',
        );

        const transaction = await queryInterface.sequelize.transaction();
        await queryInterface.bulkInsert(
            'organizations',
            [{
                name: 'Société Guyanaise Des Eaux',
                abbreviation: 'SGDE',
                active: true,
                fk_type: organization_type_id,
                fk_region: '03',
            }],
            { transaction },
        );
        await queryInterface.sequelize.query(
            'REFRESH MATERIALIZED VIEW localized_organizations',
            { transaction },
        );

        await transaction.commit();
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();
        await queryInterface.sequelize.query(
            'DELETE FROM organizations WHERE abbreviation = \'SGDE\'',
            { transaction },
        );
        await queryInterface.sequelize.query(
            'REFRESH MATERIALIZED VIEW localized_organizations',
            { transaction },
        );

        await transaction.commit();
    },
};
