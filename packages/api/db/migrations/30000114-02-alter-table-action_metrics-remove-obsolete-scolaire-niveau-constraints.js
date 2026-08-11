// Suppression de 5 contraintes CHECK résiduelles sur les niveaux scolaires (maternelle/élémentaire/collège/lycée/autre)
// Ces contraintes ont été oubliées lors du nettoyage initial (migration 30000102-04) qui a supprimé
// les autres contraintes liées à nombre_mineurs lors de l'autonomisation des indicateurs scolaires.
// Les indicateurs scolaires ne dépendent plus de nombre_mineurs depuis le 2026-06-17,
// et ces 5 contraintes relèvent de la même règle métier obsolète.
const runWithinTransaction = require('./common/helpers/transaction');
const { lessOrEqualColumnOrNull } = require('./common/helpers/constraints');

const SCHOOL_LEVELS = ['maternelle', 'elementaire', 'college', 'lycee', 'autre'];

module.exports = {
    async up(queryInterface) {
        await runWithinTransaction(queryInterface, async (transaction) => {
            await Promise.all(SCHOOL_LEVELS.map(level => queryInterface.removeConstraint(
                'action_metrics',
                `check__scolaire_nombre_${level}_lte_nombre_mineurs`,
                { transaction },
            )));
        });
    },

    async down(queryInterface) {
        await runWithinTransaction(queryInterface, async (transaction) => {
            await Promise.all(SCHOOL_LEVELS.map(level => queryInterface.addConstraint('action_metrics', {
                fields: [`scolaire_nombre_${level}`, 'nombre_mineurs'],
                type: 'check',
                name: `check__scolaire_nombre_${level}_lte_nombre_mineurs`,
                where: lessOrEqualColumnOrNull(`scolaire_nombre_${level}`, 'nombre_mineurs'),
                transaction,
            })));
        });
    },
};
