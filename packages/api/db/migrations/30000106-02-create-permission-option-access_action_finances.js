// Créer l'option permettant aux administrateurs d'accorder l'accès aux financements des actions
// pour les acteurs nationaux
module.exports = {
    up: queryInterface => queryInterface.bulkInsert(
        'permission_options',
        [
            {
                uid: 'access_action_finances',
                name: 'Accéder aux financements des actions',
            },
        ],
    ),

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            // Supprimer les assignations de cette option aux utilisateurs
            await queryInterface.sequelize.query(
                'DELETE FROM user_permission_options WHERE fk_option = \'access_action_finances\'',
                { transaction },
            );

            // Puis supprimer l'option elle-même
            await queryInterface.sequelize.query(
                'DELETE FROM permission_options WHERE uid = \'access_action_finances\'',
                { transaction },
            );

            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
