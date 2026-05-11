module.exports = {
    async up(queryInterface) {
        // Pour chaque action, marquer le premier opérateur comme principal
        await queryInterface.sequelize.query(`
            UPDATE action_operators
            SET is_principal = true
            WHERE (fk_action, fk_user) IN (
                SELECT fk_action, MIN(fk_user) as fk_user
                FROM action_operators
                GROUP BY fk_action
            )
        `);
    },

    async down(queryInterface) {
        // Remettre tous les is_principal à false
        await queryInterface.sequelize.query(`
            UPDATE action_operators
            SET is_principal = false
        `);
    },
};
