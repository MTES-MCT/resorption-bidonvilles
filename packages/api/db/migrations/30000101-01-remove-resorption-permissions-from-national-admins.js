const { QueryTypes } = require('sequelize');

module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            // Supprimer les permissions 'create' et 'update' pour shantytown_resorption
            // pour tous les utilisateurs ayant le rôle 'national_admin'
            // car ils ont maintenant un bypass automatique via "is_superuser"
            await queryInterface.sequelize.query(
                `DELETE FROM permissions
                WHERE fk_entity = 'shantytown_resorption'
                AND fk_feature IN ('create', 'update')
                AND fk_user IN (
                    SELECT user_id
                    FROM users
                    WHERE fk_role = 'national_admin'
                )`,
                { transaction },
            );

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            // Récupérer tous les utilisateurs avec le rôle national_admin
            const nationalAdmins = await queryInterface.sequelize.query(
                `SELECT DISTINCT
                    ur.user_id,
                    ur.fk_organization
                FROM users ur
                WHERE ur.fk_role = 'national_admin' AND ur.fk_status = 'active'`,
                {
                    transaction,
                    type: QueryTypes.SELECT,
                },
            );

            if (nationalAdmins.length > 0) {
                // Recréer les permissions 'create' pour les admins nationaux
                const createPermissions = nationalAdmins.map(admin => ({
                    fk_user: admin.user_id,
                    fk_feature: 'create',
                    fk_entity: 'shantytown_resorption',
                    allowed: true,
                    type: 'nation',
                    fk_region: null,
                    fk_departement: null,
                    fk_epci: null,
                    fk_city: null,
                }));

                // Recréer les permissions 'update' pour les admins nationaux
                const updatePermissions = nationalAdmins.map(admin => ({
                    fk_user: admin.user_id,
                    fk_feature: 'update',
                    fk_entity: 'shantytown_resorption',
                    allowed: true,
                    type: 'nation',
                    fk_region: null,
                    fk_departement: null,
                    fk_epci: null,
                    fk_city: null,
                }));

                await queryInterface.bulkInsert(
                    'permissions',
                    [...createPermissions, ...updatePermissions],
                    { transaction },
                );
            }

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
