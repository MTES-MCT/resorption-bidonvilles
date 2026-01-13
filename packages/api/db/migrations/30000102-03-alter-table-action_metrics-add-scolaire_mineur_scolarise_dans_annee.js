const runWithinTransaction = require('./common/helpers/transaction');
const { lessOrEqualColumnOrNull } = require('./common/helpers/constraints');

module.exports = {
    async up(queryInterface, Sequelize) {
        await runWithinTransaction(queryInterface, async (transaction) => {
            await queryInterface.addColumn(
                'action_metrics',
                'scolaire_mineur_scolarise_dans_annee',
                {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                { transaction },
            );

            await queryInterface.addConstraint('action_metrics', {
                fields: ['scolaire_mineur_scolarise_dans_annee', 'nombre_mineurs'],
                type: 'check',
                name: 'check__scolaire_mineur_scolarise_dans_annee_lte_nombre_mineurs',
                where: lessOrEqualColumnOrNull('scolaire_mineur_scolarise_dans_annee'),
                transaction,
            });
        });
    },

    async down(queryInterface) {
        await runWithinTransaction(queryInterface, async (transaction) => {
            await queryInterface.removeConstraint(
                'action_metrics',
                'check__scolaire_mineur_scolarise_dans_annee_lte_nombre_mineurs',
                { transaction },
            );

            await queryInterface.removeColumn(
                'action_metrics',
                'scolaire_mineur_scolarise_dans_annee',
                { transaction },
            );
        });
    },
};
