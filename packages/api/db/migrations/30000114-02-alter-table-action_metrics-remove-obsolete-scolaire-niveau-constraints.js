// Suppression de 5 contraintes CHECK résiduelles sur les niveaux scolaires (maternelle/élémentaire/collège/lycée/autre)
// Ces contraintes ont été oubliées lors du nettoyage initial (migration 30000102-04) qui a supprimé
// les autres contraintes liées à nombre_mineurs lors de l'autonomisation des indicateurs scolaires.
// Les indicateurs scolaires ne dépendent plus de nombre_mineurs depuis le 2026-06-17,
// et ces 5 contraintes relèvent de la même règle métier obsolète.
const runWithinTransaction = require('./common/helpers/transaction');
const { lessOrEqualColumnOrNull } = require('./common/helpers/constraints');

module.exports = {
    async up(queryInterface) {
        await runWithinTransaction(queryInterface, async (transaction) => {
            // Supprimer les 5 contraintes qui comparent les niveaux scolaires à nombre_mineurs
            await queryInterface.removeConstraint(
                'action_metrics',
                'check__scolaire_nombre_maternelle_lte_nombre_mineurs',
                { transaction },
            );

            await queryInterface.removeConstraint(
                'action_metrics',
                'check__scolaire_nombre_elementaire_lte_nombre_mineurs',
                { transaction },
            );

            await queryInterface.removeConstraint(
                'action_metrics',
                'check__scolaire_nombre_college_lte_nombre_mineurs',
                { transaction },
            );

            await queryInterface.removeConstraint(
                'action_metrics',
                'check__scolaire_nombre_lycee_lte_nombre_mineurs',
                { transaction },
            );

            await queryInterface.removeConstraint(
                'action_metrics',
                'check__scolaire_nombre_autre_lte_nombre_mineurs',
                { transaction },
            );
        });
    },

    async down(queryInterface) {
        await runWithinTransaction(queryInterface, async (transaction) => {
            // Recréer les contraintes supprimées (pour rollback)
            await queryInterface.addConstraint('action_metrics', {
                fields: ['scolaire_nombre_maternelle', 'nombre_mineurs'],
                type: 'check',
                name: 'check__scolaire_nombre_maternelle_lte_nombre_mineurs',
                where: lessOrEqualColumnOrNull('scolaire_nombre_maternelle', 'nombre_mineurs'),
                transaction,
            });

            await queryInterface.addConstraint('action_metrics', {
                fields: ['scolaire_nombre_elementaire', 'nombre_mineurs'],
                type: 'check',
                name: 'check__scolaire_nombre_elementaire_lte_nombre_mineurs',
                where: lessOrEqualColumnOrNull('scolaire_nombre_elementaire', 'nombre_mineurs'),
                transaction,
            });

            await queryInterface.addConstraint('action_metrics', {
                fields: ['scolaire_nombre_college', 'nombre_mineurs'],
                type: 'check',
                name: 'check__scolaire_nombre_college_lte_nombre_mineurs',
                where: lessOrEqualColumnOrNull('scolaire_nombre_college', 'nombre_mineurs'),
                transaction,
            });

            await queryInterface.addConstraint('action_metrics', {
                fields: ['scolaire_nombre_lycee', 'nombre_mineurs'],
                type: 'check',
                name: 'check__scolaire_nombre_lycee_lte_nombre_mineurs',
                where: lessOrEqualColumnOrNull('scolaire_nombre_lycee', 'nombre_mineurs'),
                transaction,
            });

            await queryInterface.addConstraint('action_metrics', {
                fields: ['scolaire_nombre_autre', 'nombre_mineurs'],
                type: 'check',
                name: 'check__scolaire_nombre_autre_lte_nombre_mineurs',
                where: lessOrEqualColumnOrNull('scolaire_nombre_autre', 'nombre_mineurs'),
                transaction,
            });
        });
    },
};
