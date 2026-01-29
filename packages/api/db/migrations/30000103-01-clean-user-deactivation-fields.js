module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            // Nettoyer les utilisateurs actifs qui ont encore des champs de désactivation initialisés
            await queryInterface.sequelize.query(
                `UPDATE users
                 SET 
                    deactivated_at = NULL,
                    deactivation_type = NULL
                 WHERE 
                    fk_status = 'active' 
                    AND (
                        deactivated_at IS NOT NULL 
                        OR deactivation_type IS NOT NULL
                    )`,
                {
                    transaction,
                },
            );

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    async down() {
        // Migration idempotente et irréversible
        // Les données nettoyées (deactivated_at, deactivation_type) ne peuvent être restaurées
        // automatiquement car les valeurs originales ne sont pas conservées
        // En cas de rollback nécessaire, utiliser un backup de la base de données
        // Note: cette migration ne peut être annulée automatiquement
    },
};
