// Suppression des contraintes CHECK obsolètes sur les indicateurs scolaires
// Suite à la refactorisation métier : les indicateurs scolaires sont autonomes
// et ne dépendent plus de la section "Nombre total de personnes concernées par l'action"
const runWithinTransaction = require('./common/helpers/transaction');
const { lessOrEqualColumnOrNull } = require('./common/helpers/constraints');

module.exports = {
    async up(queryInterface) {
        await runWithinTransaction(queryInterface, async (transaction) => {
            // Supprimer les contraintes qui comparent les indicateurs scolaires à nombre_mineurs
            await queryInterface.removeConstraint(
                'action_metrics',
                'check__scolaire_mineurs_moins_de_trois_ans_lte_nombre_mineurs',
                { transaction },
            );

            await queryInterface.removeConstraint(
                'action_metrics',
                'check__scolaire_mineurs_trois_ans_et_plus_lte_nombre_mineurs',
                { transaction },
            );

            await queryInterface.removeConstraint(
                'action_metrics',
                'check__scolaire_mineur_scolarise_dans_annee_lte_nombre_mineurs',
                { transaction },
            );

            // Supprimer les contraintes de médiation
            await queryInterface.removeConstraint(
                'action_metrics',
                'check__scolaire_mediation_moins_de_trois_ans_lte_scolaire_mineurs_moins_de_trois_ans',
                { transaction },
            );
        });
    },

    async down(queryInterface) {
        await runWithinTransaction(queryInterface, async (transaction) => {
            // Recréer les contraintes supprimées (pour rollback)
            await queryInterface.addConstraint('action_metrics', {
                fields: ['scolaire_mineurs_moins_de_trois_ans', 'nombre_mineurs'],
                type: 'check',
                name: 'check__scolaire_mineurs_moins_de_trois_ans_lte_nombre_mineurs',
                where: lessOrEqualColumnOrNull('scolaire_mineurs_moins_de_trois_ans', 'nombre_mineurs'),
                transaction,
            });

            await queryInterface.addConstraint('action_metrics', {
                fields: ['scolaire_mineurs_trois_ans_et_plus', 'nombre_mineurs'],
                type: 'check',
                name: 'check__scolaire_mineurs_trois_ans_et_plus_lte_nombre_mineurs',
                where: queryInterface.sequelize.literal(
                    'nombre_mineurs IS NULL OR scolaire_mineurs_trois_ans_et_plus IS NULL OR scolaire_mineurs_trois_ans_et_plus <= nombre_mineurs',
                ),
                transaction,
            });

            await queryInterface.addConstraint('action_metrics', {
                fields: ['scolaire_mineur_scolarise_dans_annee', 'nombre_mineurs'],
                type: 'check',
                name: 'check__scolaire_mineur_scolarise_dans_annee_lte_nombre_mineurs',
                where: lessOrEqualColumnOrNull('scolaire_mineur_scolarise_dans_annee', 'nombre_mineurs'),
                transaction,
            });

            await queryInterface.addConstraint('action_metrics', {
                fields: ['scolaire_mediation_moins_de_trois_ans', 'scolaire_mineurs_moins_de_trois_ans'],
                type: 'check',
                name: 'check__scolaire_mediation_moins_de_trois_ans_lte_scolaire_mineurs_moins_de_trois_ans',
                where: lessOrEqualColumnOrNull(
                    'scolaire_mediation_moins_de_trois_ans',
                    'scolaire_mineurs_moins_de_trois_ans',
                ),
                transaction,
            });
        });
    },
};
