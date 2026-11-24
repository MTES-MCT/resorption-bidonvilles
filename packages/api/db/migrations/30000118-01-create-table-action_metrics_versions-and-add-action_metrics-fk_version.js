// Versionnement des métriques d'actions.
// Jusqu'ici, created_at / created_by des lignes d'action_metrics servaient d'identifiant de version
// (rang 1 = lignes au created_at le plus récent). Cette migration introduit une table de versions et une
// clé étrangère nullable action_metrics.fk_version, afin de pouvoir conserver created_at / created_by des
// lignes inchangées lors d'une mise à jour d'action.
// Aucun backfill : les lignes existantes gardent fk_version = NULL.
// Pas d'index : tables de faible volume, et la PK d'action_metrics commence déjà par fk_action.
const runWithinTransaction = require('./common/helpers/transaction');

module.exports = {
    async up(queryInterface, Sequelize) {
        await runWithinTransaction(queryInterface, async (transaction) => {
            await queryInterface.createTable(
                'action_metrics_versions',
                {
                    action_metrics_version_id: {
                        type: Sequelize.INTEGER,
                        allowNull: false,
                        primaryKey: true,
                        autoIncrement: true,
                    },
                    fk_action: {
                        type: Sequelize.INTEGER,
                        allowNull: false,
                    },
                    version_at: {
                        type: Sequelize.DATE,
                        allowNull: false,
                        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                    },
                    version_by: {
                        type: Sequelize.INTEGER,
                        allowNull: false,
                    },
                },
                { transaction },
            );

            await queryInterface.addConstraint('action_metrics_versions', {
                fields: ['fk_action'],
                type: 'foreign key',
                name: 'fk__action_metrics_versions__action',
                references: {
                    table: 'actions',
                    field: 'action_id',
                },
                onUpdate: 'cascade',
                onDelete: 'cascade',
                transaction,
            });

            await queryInterface.addConstraint('action_metrics_versions', {
                fields: ['version_by'],
                type: 'foreign key',
                name: 'fk__action_metrics_versions__author',
                references: {
                    table: 'users',
                    field: 'user_id',
                },
                onUpdate: 'cascade',
                onDelete: 'restrict',
                transaction,
            });

            await queryInterface.addColumn(
                'action_metrics',
                'fk_version',
                {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                { transaction },
            );

            // ON DELETE NO ACTION : supprimer une version ne supprime pas silencieusement des lignes de
            // métriques, et la vérification étant différée à la fin de l'instruction, la suppression en
            // cascade d'une action (lignes + versions) reste possible.
            await queryInterface.addConstraint('action_metrics', {
                fields: ['fk_version'],
                type: 'foreign key',
                name: 'fk__action_metrics__version',
                references: {
                    table: 'action_metrics_versions',
                    field: 'action_metrics_version_id',
                },
                onUpdate: 'cascade',
                onDelete: 'no action',
                transaction,
            });
        });
    },

    async down(queryInterface) {
        await runWithinTransaction(queryInterface, async (transaction) => {
            await queryInterface.removeConstraint('action_metrics', 'fk__action_metrics__version', { transaction });
            await queryInterface.removeColumn('action_metrics', 'fk_version', { transaction });

            await queryInterface.removeConstraint('action_metrics_versions', 'fk__action_metrics_versions__action', { transaction });
            await queryInterface.removeConstraint('action_metrics_versions', 'fk__action_metrics_versions__author', { transaction });
            await queryInterface.dropTable('action_metrics_versions', { transaction });
        });
    },
};
