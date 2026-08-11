// Suppression de la contrainte CHECK résiduelle oubliée lors du renommage de colonne
// La colonne scolaire_mineurs_en_mediation a été renommée en scolaire_mediation_trois_ans_et_plus
// dans la migration 30000102-02, mais PostgreSQL a suivi le renommage uniquement dans la définition
// de la contrainte, PAS dans son nom. La contrainte check__scolaire_mineurs_en_mediation_lte_nombre_mineurs
// existe donc toujours et contrôle désormais scolaire_mediation_trois_ans_et_plus <= nombre_mineurs.
// Cette règle métier n'a plus de sens depuis l'autonomisation des indicateurs scolaires
// (migration 30000102-04) et doit être supprimée.
const runWithinTransaction = require('./common/helpers/transaction');
const { lessOrEqualColumnOrNull } = require('./common/helpers/constraints');

module.exports = {
    async up(queryInterface) {
        await runWithinTransaction(queryInterface, async (transaction) => {
            // Supprimer la contrainte résiduelle qui porte encore l'ancien nom de colonne
            await queryInterface.removeConstraint(
                'action_metrics',
                'check__scolaire_mineurs_en_mediation_lte_nombre_mineurs',
                { transaction },
            );
        });
    },

    async down(queryInterface) {
        await runWithinTransaction(queryInterface, async (transaction) => {
            // Recréer la contrainte avec le nom de colonne actuel (pour rollback)
            // Note : on utilise un nouveau nom de contrainte cohérent avec le nom actuel de la colonne
            await queryInterface.addConstraint('action_metrics', {
                fields: ['scolaire_mediation_trois_ans_et_plus', 'nombre_mineurs'],
                type: 'check',
                name: 'check__scolaire_mediation_trois_ans_et_plus_lte_nombre_mineurs',
                where: lessOrEqualColumnOrNull('scolaire_mediation_trois_ans_et_plus', 'nombre_mineurs'),
                transaction,
            });
        });
    },
};
