module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        // Création du type 'DEAL'
        await queryInterface.bulkInsert(
            'organization_types',
            [{
                name_singular: 'Direction de l’économie, de l’emploi, du travail et des solidarités',
                name_plural: 'Directions de l’économie, de l’emploi, du travail et des solidarités',
                abbreviation: 'DEETS',
                fk_category: 'public_establishment',
                fk_role: 'collaborator',
                uid: 'deets',
            }],
            { transaction },
        );

        // Récupération de l'identifiant du type 'DEETS'
        const [{ organization_type_id }] = await queryInterface.sequelize.query(
            'SELECT organization_type_id FROM organization_types WHERE uid = \'deets\'',
            {
                type: queryInterface.sequelize.QueryTypes.SELECT,
                transaction,
            },
        );

        await queryInterface.bulkInsert(
            'organizations',
            [{
                name: 'Direction de l’économie, de l’emploi, du travail et des solidarités - Guadeloupe',
                abbreviation: 'DEETS - Guadeloupe',
                active: true,
                fk_type: organization_type_id,
                being_funded: false,
            },
            {
                name: 'Direction de l’économie, de l’emploi, du travail et des solidarités - Martinique',
                abbreviation: 'DEETS - Martinique',
                active: true,
                fk_type: organization_type_id,
                being_funded: false,
            },
            {
                name: 'Direction de l’économie, de l’emploi, du travail et des solidarités - Guyane',
                abbreviation: 'DEETS - Guyane',
                active: true,
                fk_type: organization_type_id,
                being_funded: false,
            },
            {
                name: 'Direction de l’économie, de l’emploi, du travail et des solidarités - La Réunion',
                abbreviation: 'DEETS - La Réunion',
                active: true,
                fk_type: organization_type_id,
                being_funded: false,
            },
            {
                name: 'Direction de l’économie, de l’emploi, du travail et des solidarités - Mayotte',
                abbreviation: 'DEETS - Mayotte',
                active: true,
                fk_type: organization_type_id,
                being_funded: false,
            },
        ],
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

        await queryInterface.sequelize.query(
            'DELETE FROM organizations WHERE abbreviation ILIKE \'DEETS - %\'',
            {
                transaction,
            },
        );
        await queryInterface.sequelize.query(
            'DELETE FROM organization_types WHERE uid = \'deets\'',
            {
                transaction,
            },
        );
        await queryInterface.sequelize.query(
            'REFRESH MATERIALIZED VIEW localized_organizations',
            { transaction },
        );

        return transaction.commit();
    },
};
