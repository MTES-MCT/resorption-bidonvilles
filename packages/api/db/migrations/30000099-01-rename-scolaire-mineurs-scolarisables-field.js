// Renommage du champ scolaire_mineurs_scolarisables en scolaire_mineurs_trois_ans_et_plus
module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            // Supprimer l'ancienne contrainte check
            await queryInterface.removeConstraint(
                'action_metrics',
                'check__scolaire_mineurs_scolarisables_lte_nombre_mineurs',
                { transaction },
            );

            // Renommer la colonne
            await queryInterface.renameColumn(
                'action_metrics',
                'scolaire_mineurs_scolarisables',
                'scolaire_mineurs_trois_ans_et_plus',
                { transaction },
            );

            // Recréer la contrainte check avec le nouveau nom de colonne
            await queryInterface.addConstraint('action_metrics', {
                fields: ['scolaire_mineurs_trois_ans_et_plus', 'nombre_mineurs'],
                type: 'check',
                name: 'check__scolaire_mineurs_trois_ans_et_plus_lte_nombre_mineurs',
                where: queryInterface.sequelize.literal(
                    'nombre_mineurs IS NULL OR scolaire_mineurs_trois_ans_et_plus IS NULL OR scolaire_mineurs_trois_ans_et_plus <= nombre_mineurs',
                ),
                transaction,
            });

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            // Supprimer la nouvelle contrainte check
            await queryInterface.removeConstraint(
                'action_metrics',
                'check__scolaire_mineurs_trois_ans_et_plus_lte_nombre_mineurs',
                { transaction },
            );

            // Renommer la colonne (restaurer l'ancien nom)
            await queryInterface.renameColumn(
                'action_metrics',
                'scolaire_mineurs_trois_ans_et_plus',
                'scolaire_mineurs_scolarisables',
                { transaction },
            );

            // Recréer l'ancienne contrainte check
            await queryInterface.addConstraint('action_metrics', {
                fields: ['scolaire_mineurs_scolarisables', 'nombre_mineurs'],
                type: 'check',
                name: 'check__scolaire_mineurs_scolarisables_lte_nombre_mineurs',
                where: queryInterface.sequelize.literal(
                    'nombre_mineurs IS NULL OR scolaire_mineurs_scolarisables IS NULL OR scolaire_mineurs_scolarisables <= nombre_mineurs',
                ),
                transaction,
            });

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
