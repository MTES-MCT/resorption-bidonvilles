// Renommage de scolaire_mineurs_en_mediation et ajout des champs pour les mineurs de moins de 3 ans
module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            // Renommer scolaire_mineurs_en_mediation en scolaire_mediation_trois_ans_et_plus
            await queryInterface.renameColumn(
                'action_metrics',
                'scolaire_mineurs_en_mediation',
                'scolaire_mediation_trois_ans_et_plus',
                { transaction },
            );

            // Ajouter les nouvelles colonnes
            await queryInterface.addColumn(
                'action_metrics',
                'scolaire_mineurs_moins_de_trois_ans',
                {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                { transaction },
            );

            await queryInterface.addColumn(
                'action_metrics',
                'scolaire_mediation_moins_de_trois_ans',
                {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                { transaction },
            );

            // Créer les contraintes check
            // scolaire_mineurs_moins_de_trois_ans <= nombre_mineurs
            await queryInterface.addConstraint('action_metrics', {
                fields: ['scolaire_mineurs_moins_de_trois_ans', 'nombre_mineurs'],
                type: 'check',
                name: 'check__scolaire_mineurs_moins_de_trois_ans_lte_nombre_mineurs',
                where: queryInterface.sequelize.literal(
                    'nombre_mineurs IS NULL OR scolaire_mineurs_moins_de_trois_ans IS NULL OR scolaire_mineurs_moins_de_trois_ans <= nombre_mineurs',
                ),
                transaction,
            });

            // scolaire_mediation_moins_de_trois_ans <= scolaire_mineurs_moins_de_trois_ans
            await queryInterface.addConstraint('action_metrics', {
                fields: ['scolaire_mediation_moins_de_trois_ans', 'scolaire_mineurs_moins_de_trois_ans'],
                type: 'check',
                name: 'check__scolaire_mediation_moins_de_trois_ans_lte_scolaire_mineurs_moins_de_trois_ans',
                where: queryInterface.sequelize.literal(
                    'scolaire_mineurs_moins_de_trois_ans IS NULL OR scolaire_mediation_moins_de_trois_ans IS NULL OR scolaire_mediation_moins_de_trois_ans <= scolaire_mineurs_moins_de_trois_ans',
                ),
                transaction,
            });

            // Lignes suivantes mises en commentaires pour éviter des erreurs de contrainte non corrigées en bdd
            // scolaire_mediation_trois_ans_et_plus <= scolaire_mineurs_trois_ans_et_plus
            // await queryInterface.addConstraint('action_metrics', {
            //     fields: ['scolaire_mediation_trois_ans_et_plus', 'scolaire_mineurs_trois_ans_et_plus'],
            //     type: 'check',
            //     name: 'check__scolaire_mediation_trois_ans_et_plus_lte_scolaire_mineurs_trois_ans_et_plus',
            //     where: queryInterface.sequelize.literal(
            //         'scolaire_mineurs_trois_ans_et_plus IS NULL OR scolaire_mediation_trois_ans_et_plus IS NULL OR scolaire_mediation_trois_ans_et_plus <= scolaire_mineurs_trois_ans_et_plus',
            //     ),
            //     transaction,
            // });

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            // Supprimer les contraintes check
            await queryInterface.removeConstraint(
                'action_metrics',
                'check__scolaire_mineurs_moins_de_trois_ans_lte_nombre_mineurs',
                { transaction },
            );

            await queryInterface.removeConstraint(
                'action_metrics',
                'check__scolaire_mediation_moins_de_trois_ans_lte_scolaire_mineurs_moins_de_trois_ans',
                { transaction },
            );

            // await queryInterface.removeConstraint(
            //     'action_metrics',
            //     'check__scolaire_mediation_trois_ans_et_plus_lte_scolaire_mineurs_trois_ans_et_plus',
            //     { transaction },
            // );

            // Supprimer les colonnes ajoutées
            await queryInterface.removeColumn(
                'action_metrics',
                'scolaire_mediation_moins_de_trois_ans',
                { transaction },
            );

            await queryInterface.removeColumn(
                'action_metrics',
                'scolaire_mineurs_moins_de_trois_ans',
                { transaction },
            );

            // Renommer scolaire_mediation_trois_ans_et_plus en scolaire_mineurs_en_mediation (restaurer l'ancien nom)
            await queryInterface.renameColumn(
                'action_metrics',
                'scolaire_mediation_trois_ans_et_plus',
                'scolaire_mineurs_en_mediation',
                { transaction },
            );

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
