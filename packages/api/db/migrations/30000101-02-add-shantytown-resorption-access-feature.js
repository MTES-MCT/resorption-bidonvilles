const { QueryTypes } = require('sequelize');

module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            // Créer la feature 'export' pour shantytown_resorption
            await queryInterface.bulkInsert(
                'features',
                [{
                    name: 'export',
                    fk_entity: 'shantytown_resorption',
                    is_writing: false,
                }],
                { transaction },
            );

            // Récupérer tous les utilisateurs qui ont déjà des permissions sur shantytown_resorption
            const usersWithResorptionPermissions = await queryInterface.sequelize.query(
                `SELECT DISTINCT
                    fk_user,
                    fk_organization,
                    type,
                    fk_region,
                    fk_departement,
                    fk_epci,
                    fk_city
                FROM permissions
                WHERE fk_entity = 'shantytown_resorption'
                AND allowed = true`,
                {
                    transaction,
                    type: QueryTypes.SELECT,
                },
            );

            // Créer les permissions 'export' pour ces utilisateurs
            if (usersWithResorptionPermissions.length > 0) {
                const permissionsToInsert = usersWithResorptionPermissions.map(user => ({
                    fk_user: user.fk_user,
                    fk_organization: user.fk_organization,
                    fk_feature: 'export',
                    fk_entity: 'shantytown_resorption',
                    allowed: true,
                    type: user.type,
                    fk_region: user.fk_region,
                    fk_departement: user.fk_departement,
                    fk_epci: user.fk_epci,
                    fk_city: user.fk_city,
                }));

                await queryInterface.bulkInsert('permissions', permissionsToInsert, { transaction });
            }

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            // Supprimer les permissions 'export' pour shantytown_resorption
            await queryInterface.sequelize.query(
                `DELETE FROM permissions
                WHERE fk_entity = 'shantytown_resorption'
                AND fk_feature = 'export'`,
                { transaction },
            );

            // Supprimer la feature 'export'
            await queryInterface.sequelize.query(
                `DELETE FROM features
                WHERE fk_entity = 'shantytown_resorption'
                AND name = 'export'`,
                { transaction },
            );

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
