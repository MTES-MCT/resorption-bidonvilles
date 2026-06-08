// Synchronise le schéma de action_metrics_history avec action_metrics :
// - renomme les colonnes scolaires renommées par 30000102-01 et 30000102-02
// - ajoute les colonnes scolaires "moins de trois ans" ajoutées par 30000102-02
// (action_metrics_history avait été créée en 30000109-01 avec les anciens noms)
const runWithinTransaction = require('./common/helpers/transaction');

module.exports = {
    async up(queryInterface, Sequelize) {
        await runWithinTransaction(queryInterface, async (transaction) => {
            // Renommer scolaire_mineurs_scolarisables en scolaire_mineurs_trois_ans_et_plus
            await queryInterface.renameColumn(
                'action_metrics_history',
                'scolaire_mineurs_scolarisables',
                'scolaire_mineurs_trois_ans_et_plus',
                { transaction },
            );

            // Renommer scolaire_mineurs_en_mediation en scolaire_mediation_trois_ans_et_plus
            await queryInterface.renameColumn(
                'action_metrics_history',
                'scolaire_mineurs_en_mediation',
                'scolaire_mediation_trois_ans_et_plus',
                { transaction },
            );

            // Ajouter scolaire_mineurs_moins_de_trois_ans
            await queryInterface.addColumn(
                'action_metrics_history',
                'scolaire_mineurs_moins_de_trois_ans',
                {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                { transaction },
            );

            // Ajouter scolaire_mediation_moins_de_trois_ans
            await queryInterface.addColumn(
                'action_metrics_history',
                'scolaire_mediation_moins_de_trois_ans',
                {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                { transaction },
            );
        });
    },

    async down(queryInterface) {
        await runWithinTransaction(queryInterface, async (transaction) => {
            // Supprimer les colonnes ajoutées
            await queryInterface.removeColumn(
                'action_metrics_history',
                'scolaire_mediation_moins_de_trois_ans',
                { transaction },
            );

            await queryInterface.removeColumn(
                'action_metrics_history',
                'scolaire_mineurs_moins_de_trois_ans',
                { transaction },
            );

            // Restaurer les anciens noms de colonnes
            await queryInterface.renameColumn(
                'action_metrics_history',
                'scolaire_mediation_trois_ans_et_plus',
                'scolaire_mineurs_en_mediation',
                { transaction },
            );

            await queryInterface.renameColumn(
                'action_metrics_history',
                'scolaire_mineurs_trois_ans_et_plus',
                'scolaire_mineurs_scolarisables',
                { transaction },
            );
        });
    },
};
