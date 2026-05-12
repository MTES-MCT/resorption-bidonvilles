const runInTransaction = async (queryInterface, callback) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
        await callback(transaction);
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

module.exports = {
    async up(queryInterface) {
        await runInTransaction(queryInterface, async (transaction) => {
            // 1. Marquer comme principal le premier opérateur actif (fk_status != 'inactive')
            //    de chaque action, en prenant le MIN(fk_user) parmi les actifs.
            await queryInterface.sequelize.query(
                `
                UPDATE action_operators
                SET is_principal = true
                WHERE (fk_action, fk_user) IN (
                    SELECT ao.fk_action, MIN(ao.fk_user) AS fk_user
                    FROM action_operators ao
                    INNER JOIN users u ON ao.fk_user = u.user_id
                    WHERE u.fk_status != 'inactive'
                    GROUP BY ao.fk_action
                )
                `,
                { transaction },
            );

            // 2. Fallback : pour les actions dont tous les opérateurs sont désactivés,
            //    aucun principal n'a été positionné par l'étape 1.
            //    On leur applique le MIN(fk_user) sans filtre de statut afin qu'elles
            //    conservent un opérateur principal et que computeActionNames puisse
            //    calculer un nom pour ces actions.
            await queryInterface.sequelize.query(
                `
                UPDATE action_operators
                SET is_principal = true
                WHERE (fk_action, fk_user) IN (
                    SELECT ao.fk_action, MIN(ao.fk_user) AS fk_user
                    FROM action_operators ao
                    WHERE NOT EXISTS (
                        SELECT 1
                        FROM action_operators ao2
                        WHERE ao2.fk_action = ao.fk_action
                          AND ao2.is_principal = true
                    )
                    GROUP BY ao.fk_action
                )
                `,
                { transaction },
            );
        });
    },

    async down(queryInterface) {
        // Remettre tous les is_principal à false
        await queryInterface.sequelize.query(`
            UPDATE action_operators
            SET is_principal = false
        `);
    },
};
