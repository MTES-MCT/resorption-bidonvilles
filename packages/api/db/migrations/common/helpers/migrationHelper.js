const { addForeignKey, removeForeignKey } = require('./manageForeignKeys');

/**
 * Exécute une opération de migration dans une transaction
 *
 * @param {Object} queryInterface - L'interface de requête Sequelize
 * @param {Function} action - La fonction contenant les opérations de migration
 * @returns {Promise} - Le résultat de l'action
 */
const withTransaction = async (queryInterface, action) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
        await action(transaction);
        await transaction.commit();
    } catch (err) {
        await transaction.rollback();
        throw err;
    }
};

/**
 * Crée une table avec des clés étrangères et des index
 *
 * @param {Object} queryInterface - L'interface de requête Sequelize
 * @param {String} tableName - Nom de la table à créer
 * @param {Object} tableDefinition - Définition des colonnes de la table
 * @param {Array} foreignKeys - Liste des clés étrangères à ajouter
 * @param {Array} indexes - Liste des index à ajouter
 */
const createTableWithForeignKeys = async (queryInterface, {
    tableName,
    tableDefinition,
    foreignKeys = [],
    indexes = [],
}) => withTransaction(queryInterface, async (transaction) => {
    // Créer la table
    await queryInterface.createTable(tableName, tableDefinition, { transaction });

    // Ajouter les clés étrangères
    if (foreignKeys.length > 0) {
        await Promise.all(
            foreignKeys.map(fk => addForeignKey(queryInterface, {
                table: tableName,
                onUpdate: fk.onUpdate || 'cascade',
                onDelete: fk.onDelete || 'cascade',
                transaction,
                ...fk,
            })),
        );
    }

    // Ajouter les index
    if (indexes.length > 0) {
        await Promise.all(
            indexes.map(idx => queryInterface.addIndex(
                tableName,
                idx.fields,
                {
                    name: idx.name || `idx__${tableName}__${idx.fields.join('_')}`,
                    using: idx.using || 'BTREE',
                    schema: idx.schema || 'public',
                    transaction,
                },
            )),
        );
    }
});

/**
 * Supprime une table et ses clés étrangères
 *
 * @param {Object} queryInterface - L'interface de requête Sequelize
 * @param {String} tableName - Nom de la table à supprimer
 * @param {Array} refTables - Liste des tables référencées par les clés étrangères
 */
const dropTableWithForeignKeys = async (queryInterface, { tableName, refTables = [] }) => withTransaction(queryInterface, async (transaction) => {
    if (refTables.length > 0) {
        await Promise.all(
            refTables.map(refTable => removeForeignKey(queryInterface, {
                table: tableName,
                refTable,
                transaction,
            })),
        );
    }

    await queryInterface.dropTable(tableName, { transaction });
});

/**
 * Modifie une table existante
 *
 * @param {Object} queryInterface - L'interface de requête Sequelize
 * @param {Function} alterAction - La fonction contenant les opérations d'altération
 */
const alterTable = async (queryInterface, alterAction) => withTransaction(queryInterface, alterAction);

module.exports = {
    withTransaction,
    createTableWithForeignKeys,
    dropTableWithForeignKeys,
    alterTable,
};
