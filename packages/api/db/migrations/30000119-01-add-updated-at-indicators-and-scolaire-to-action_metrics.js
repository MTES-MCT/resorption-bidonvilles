// Dates de fraîcheur par nature d'indicateur (non scolaire / scolaire) sur action_metrics.
// Colonnes nullables, sans défaut et sans backfill : NULL est lu comme COALESCE(colonne, version_at, created_at).
const runWithinTransaction = require('./common/helpers/transaction');

module.exports = {
    async up(queryInterface, Sequelize) {
        await runWithinTransaction(queryInterface, async (transaction) => {
            await queryInterface.addColumn(
                'action_metrics',
                'updated_at_indicators',
                {
                    type: Sequelize.DATE,
                    allowNull: true,
                },
                { transaction },
            );

            await queryInterface.addColumn(
                'action_metrics',
                'updated_at_scolaire',
                {
                    type: Sequelize.DATE,
                    allowNull: true,
                },
                { transaction },
            );
        });
    },

    async down(queryInterface) {
        await runWithinTransaction(queryInterface, async (transaction) => {
            await queryInterface.removeColumn('action_metrics', 'updated_at_scolaire', { transaction });
            await queryInterface.removeColumn('action_metrics', 'updated_at_indicators', { transaction });
        });
    },
};
