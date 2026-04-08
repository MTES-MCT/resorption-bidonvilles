// Historisation des métriques d'actions
module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            // Création de la table action_metrics_history
            await queryInterface.createTable(
                'action_metrics_history',
                {
                    fk_action: {
                        type: Sequelize.INTEGER,
                        allowNull: false,
                        primaryKey: true,
                    },
                    date: {
                        type: Sequelize.DATEONLY,
                        allowNull: false,
                        primaryKey: true,
                    },
                    nombre_personnes: {
                        type: Sequelize.INTEGER,
                        allowNull: true,
                    },
                    nombre_menages: {
                        type: Sequelize.INTEGER,
                        allowNull: true,
                    },
                    nombre_femmes: {
                        type: Sequelize.INTEGER,
                        allowNull: true,
                    },
                    nombre_mineurs: {
                        type: Sequelize.INTEGER,
                        allowNull: true,
                    },
                    sante_nombre_personnes: {
                        type: Sequelize.INTEGER,
                        allowNull: true,
                    },
                    travail_nombre_personnes: {
                        type: Sequelize.INTEGER,
                        allowNull: true,
                    },
                    travail_nombre_femmes: {
                        type: Sequelize.INTEGER,
                        allowNull: true,
                    },
                    hebergement_nombre_personnes: {
                        type: Sequelize.INTEGER,
                        allowNull: true,
                    },
                    hebergement_nombre_menages: {
                        type: Sequelize.INTEGER,
                        allowNull: true,
                    },
                    logement_nombre_personnes: {
                        type: Sequelize.INTEGER,
                        allowNull: true,
                    },
                    logement_nombre_menages: {
                        type: Sequelize.INTEGER,
                        allowNull: true,
                    },
                    scolaire_mineurs_scolarisables: {
                        type: Sequelize.INTEGER,
                        allowNull: true,
                    },
                    scolaire_mineurs_en_mediation: {
                        type: Sequelize.INTEGER,
                        allowNull: true,
                    },
                    scolaire_nombre_maternelle: {
                        type: Sequelize.INTEGER,
                        allowNull: true,
                    },
                    scolaire_nombre_elementaire: {
                        type: Sequelize.INTEGER,
                        allowNull: true,
                    },
                    scolaire_nombre_college: {
                        type: Sequelize.INTEGER,
                        allowNull: true,
                    },
                    scolaire_nombre_lycee: {
                        type: Sequelize.INTEGER,
                        allowNull: true,
                    },
                    scolaire_nombre_autre: {
                        type: Sequelize.INTEGER,
                        allowNull: true,
                    },
                    scolaire_mineur_scolarise_dans_annee: {
                        type: Sequelize.INTEGER,
                        allowNull: true,
                    },
                    created_at: {
                        type: Sequelize.DATE,
                        allowNull: false,
                        primaryKey: true,
                    },
                    created_by: {
                        type: Sequelize.INTEGER,
                        allowNull: false,
                    },
                },
                {
                    transaction,
                },
            );

            // Création des contraintes (clés étrangères)
            await queryInterface.addConstraint('action_metrics_history', {
                fields: ['fk_action'],
                type: 'foreign key',
                name: 'fk__action_metrics_history__action',
                references: {
                    table: 'actions_history',
                    field: 'hid',
                },
                onUpdate: 'cascade',
                onDelete: 'cascade',
                transaction,
            });

            await queryInterface.addConstraint('action_metrics_history', {
                fields: ['created_by'],
                type: 'foreign key',
                name: 'fk__action_metrics_history__creator',
                references: {
                    table: 'users',
                    field: 'user_id',
                },
                onUpdate: 'cascade',
                onDelete: 'restrict',
                transaction,
            });

            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await queryInterface.removeConstraint(
                'action_metrics_history',
                'fk__action_metrics_history__action',
                { transaction },
            );
            await queryInterface.removeConstraint(
                'action_metrics_history',
                'fk__action_metrics_history__creator',
                { transaction },
            );

            await queryInterface.dropTable('action_metrics_history', { transaction });

            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
