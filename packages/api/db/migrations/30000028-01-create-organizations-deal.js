module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        // Création du type 'DEAL'
        await queryInterface.bulkInsert(
            'organization_types',
            [{
                name_singular: 'Direction de l’Environnement, de l’Aménagement et du Logement',
                name_plural: 'Direction de l’Environnement, de l’Aménagement et du Logement',
                abbreviation: 'DEAL',
                fk_category: 'public_establishment',
                fk_role: 'collaborator',
                uid: 'deal',
            }],
            { transaction },
        );

        // Récupération de l'identifiant du type 'DEAL'
        const [{ organization_type_id }] = await queryInterface.sequelize.query(
            'SELECT organization_type_id FROM organization_types WHERE uid = \'deal\'',
            {
                type: queryInterface.sequelize.QueryTypes.SELECT,
                transaction,
            },
        );

        await queryInterface.bulkInsert(
            'organizations',
            [{
                name: 'Direction de l’Environnement, de l’Aménagement et du Logement - Guadeloupe',
                abbreviation: 'DEAL - Guadeloupe',
                active: true,
                fk_type: organization_type_id,
                being_funded: false,
            },
            {
                name: 'Direction de l’Environnement, de l’Aménagement et du Logement - Martinique',
                abbreviation: 'DEAL - Martinique',
                active: true,
                fk_type: organization_type_id,
                being_funded: false,
            },
            {
                name: 'Direction de l’Environnement, de l’Aménagement et du Logement - Guyane',
                abbreviation: 'DEAL - Guyane',
                active: true,
                fk_type: organization_type_id,
                being_funded: false,
            },
            {
                name: 'Direction de l’Environnement, de l’Aménagement et du Logement - La Réunion',
                abbreviation: 'DEAL - La Réunion',
                active: true,
                fk_type: organization_type_id,
                being_funded: false,
            },
            {
                name: 'Direction de l’Environnement, de l’Aménagement et du Logement - Mayotte',
                abbreviation: 'DEAL - Mayotte',
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
            'DELETE FROM organizations WHERE abbreviation = \'DEAL\'',
            {
                transaction,
            },
        );
        await queryInterface.sequelize.query(
            'DELETE FROM organization_types WHERE uid = \'deal\'',
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
