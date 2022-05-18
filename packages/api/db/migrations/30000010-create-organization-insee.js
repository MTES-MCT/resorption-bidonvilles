module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

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
                name: 'Institut national de la statistique et des études économiques',
                abbreviation: 'INSEE',
                active: true,
                fk_type: organization_type_id,
                being_funded: false,
            }],
            { transaction },
        );
        await queryInterface.sequelize.query('REFRESH MATERIALIZED VIEW localized_organizations', { transaction });

        await transaction.commit();
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        await queryInterface.sequelize.query(
            'DELETE FROM organizations WHERE abbreviation = \'INSEE\'',
            {
                transaction,
            },
        );
        await queryInterface.sequelize.query('REFRESH MATERIALIZED VIEW localized_organizations', { transaction });

        await transaction.commit();
    },
};
