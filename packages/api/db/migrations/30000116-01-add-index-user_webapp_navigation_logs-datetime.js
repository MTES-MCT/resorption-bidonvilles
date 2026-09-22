// Ajout d'un index B-tree sur user_webapp_navigation_logs.datetime
// La requête WAU (packages/api/server/models/statsModel/getStats.ts) filtre et trie sur cette
// colonne mais aucun index n'existe, ce qui force un scan complet de la table (alerte Sentry).
const runWithinTransaction = require('./common/helpers/transaction');

module.exports = {
    async up(queryInterface) {
        await runWithinTransaction(queryInterface, async (transaction) => {
            await queryInterface.addIndex(
                'user_webapp_navigation_logs',
                ['datetime'],
                {
                    name: 'idx_user_webapp_navigation_logs_datetime',
                    using: 'BTREE',
                    transaction,
                },
            );
        });
    },

    async down(queryInterface) {
        await runWithinTransaction(queryInterface, async (transaction) => {
            await queryInterface.removeIndex(
                'user_webapp_navigation_logs',
                'idx_user_webapp_navigation_logs_datetime',
                { transaction },
            );
        });
    },
};
