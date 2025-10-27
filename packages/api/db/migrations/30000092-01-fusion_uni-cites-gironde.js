module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            // Vérifier si des utilisateurs sont liés à l'organisation 43036
            const [results] = await queryInterface.sequelize.query(
                "SELECT COUNT(*) as count FROM users WHERE fk_organization = 43036 AND fk_status = 'active'",
                { transaction },
            );

            const userCount = parseInt(results[0].count, 10);

            // Si aucun utilisateur n'est affecté à l'organisation 43036
            if (userCount === 0) {
                // Désactiver l'organisation 43036
                await queryInterface.sequelize.query(
                    'UPDATE organizations SET active = false WHERE organization_id = 43036',
                    { transaction },
                );
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
            // Réactiver l'organisation 43036
            await queryInterface.sequelize.query(
                'UPDATE organizations SET active = true WHERE organization_id = 43036',
                { transaction },
            );

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
