// Ajout d'index B-tree sur les colonnes fk_departement / fk_epci / fk_region jointes par
// packages/api/server/models/interventionAreaModel/list.ts (alerte Sentry sur requête lente).
// Sous PostgreSQL, une contrainte FOREIGN KEY ne crée jamais automatiquement un index côté
// colonne référençante, d'où l'absence d'index sur ces colonnes malgré leurs contraintes FK.
const runWithinTransaction = require('./common/helpers/transaction');

module.exports = {
    async up(queryInterface) {
        await runWithinTransaction(queryInterface, async (transaction) => {
            await queryInterface.addIndex(
                'cities',
                ['fk_departement'],
                {
                    name: 'idx_cities_fk_departement',
                    using: 'BTREE',
                    transaction,
                },
            );

            await queryInterface.addIndex(
                'cities',
                ['fk_epci'],
                {
                    name: 'idx_cities_fk_epci',
                    using: 'BTREE',
                    transaction,
                },
            );

            await queryInterface.addIndex(
                'departements',
                ['fk_region'],
                {
                    name: 'idx_departements_fk_region',
                    using: 'BTREE',
                    transaction,
                },
            );
        });
    },

    async down(queryInterface) {
        await runWithinTransaction(queryInterface, async (transaction) => {
            await queryInterface.removeIndex(
                'cities',
                'idx_cities_fk_departement',
                { transaction },
            );

            await queryInterface.removeIndex(
                'cities',
                'idx_cities_fk_epci',
                { transaction },
            );

            await queryInterface.removeIndex(
                'departements',
                'idx_departements_fk_region',
                { transaction },
            );
        });
    },
};
