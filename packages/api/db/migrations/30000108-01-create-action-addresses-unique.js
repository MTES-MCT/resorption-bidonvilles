/* eslint-disable no-console */
const { addForeignKey } = require('./common/manageForeignKeys');

module.exports = {
    async up(queryInterface, Sequelize) {
        const commonColumns = {
            fk_action: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            fk_city: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            address: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            latitude: {
                type: Sequelize.DOUBLE,
                allowNull: false,
            },
            longitude: {
                type: Sequelize.DOUBLE,
                allowNull: false,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
        };

        const transaction = await queryInterface.sequelize.transaction();

        // Définition des conditions WHERE mutualisées pour les contraintes check
        const locationCheckConditions = {
            [Sequelize.Op.or]: [
                {
                    location_type: 'autre',
                    location_other: { [Sequelize.Op.ne]: null },
                },
                {
                    location_type: { [Sequelize.Op.in]: ['logement', 'sur_site', 'eti'] },
                    location_other: null,
                },
            ],
        };

        try {
            // Phase 1 : Créer la table action_addresses
            await queryInterface.createTable(
                'action_addresses',
                {
                    action_address_id: {
                        type: Sequelize.INTEGER,
                        allowNull: false,
                        primaryKey: true,
                        autoIncrement: true,
                    },
                    ...commonColumns,
                },
                { transaction },
            );

            // Phase 2 : Créer la table d'historique
            await queryInterface.createTable(
                'action_addresses_history',
                {
                    hid: {
                        type: Sequelize.INTEGER,
                        allowNull: false,
                        primaryKey: true,
                        autoIncrement: true,
                    },
                    action_address_id: {
                        type: Sequelize.INTEGER,
                        allowNull: false,
                    },
                    action_hid: {
                        type: Sequelize.INTEGER,
                        allowNull: false,
                    },
                    ...commonColumns,
                },
                { transaction },
            );

            // Phase 3 : Ajouter les contraintes pour action_addresses
            await Promise.all([
                addForeignKey(queryInterface, 'action_addresses', ['fk_action'], 'actions', 'action_id', 'cascade', 'cascade', transaction),
                addForeignKey(queryInterface, 'action_addresses', ['fk_city'], 'cities', 'code', 'cascade', 'restrict', transaction),
                queryInterface.addConstraint('action_addresses', {
                    fields: ['fk_action', 'address', 'latitude', 'longitude', 'fk_city'],
                    type: 'unique',
                    name: 'uq__action_addresses__unique_address',
                    transaction,
                }),
            ]);

            // Phase 4 : Ajouter les contraintes pour action_addresses_history
            await Promise.all([
                addForeignKey(queryInterface, 'action_addresses_history', ['fk_action'], 'actions', 'action_id', 'cascade', 'cascade', transaction),
                addForeignKey(queryInterface, 'action_addresses_history', ['action_hid'], 'actions_history', 'hid', 'cascade', 'cascade', transaction),
                addForeignKey(queryInterface, 'action_addresses_history', ['fk_city'], 'cities', 'code', 'cascade', 'restrict', transaction),
            ]);

            // Phase 5 : Migrer les données des lieux de type "eti" depuis la table actions vers action_addresses
            await queryInterface.sequelize.query(
                `INSERT INTO action_addresses (fk_action, address, latitude, longitude, fk_city, created_at)
                SELECT 
                    action_id,
                    address,
                    latitude,
                    longitude,
                    eti_fk_city,
                    created_at
                FROM actions
                WHERE location_type = 'eti'`,
                { transaction },
            );

            // Phase 6 : Migrer les données historiques des lieux de type "eti"
            await queryInterface.sequelize.query(
                `INSERT INTO action_addresses_history (action_address_id, fk_action, action_hid, address, latitude, longitude, fk_city, created_at)
                SELECT 
                    aa.action_address_id,
                    ah.action_id,
                    ah.hid,
                    ah.address,
                    ah.latitude,
                    ah.longitude,
                    ah.eti_fk_city,
                    ah.created_at
                FROM actions_history ah
                LEFT JOIN action_addresses aa ON aa.fk_action = ah.action_id
                WHERE ah.location_type = 'eti'
                  AND ah.address IS NOT NULL
                  AND ah.latitude IS NOT NULL
                  AND ah.longitude IS NOT NULL
                  AND ah.eti_fk_city IS NOT NULL
                  AND aa.action_address_id IS NOT NULL`,
                { transaction },
            );

            // Phase 7 : Supprimer les contraintes check (elles référencent les colonnes à supprimer)
            await queryInterface.removeConstraint('actions', 'check_actions_location_columns', { transaction });
            await queryInterface.removeConstraint('actions_history', 'check_actions_history_location_columns', { transaction });

            // Phase 8 : Supprimer les colonnes obsolètes dans actions et actions_history
            await Promise.all([
                queryInterface.removeColumn('actions', 'address', { transaction }),
                queryInterface.removeColumn('actions', 'latitude', { transaction }),
                queryInterface.removeColumn('actions', 'longitude', { transaction }),
                queryInterface.removeColumn('actions', 'eti_fk_city', { transaction }),
                queryInterface.removeColumn('actions_history', 'address', { transaction }),
                queryInterface.removeColumn('actions_history', 'latitude', { transaction }),
                queryInterface.removeColumn('actions_history', 'longitude', { transaction }),
                queryInterface.removeColumn('actions_history', 'eti_fk_city', { transaction }),
            ]);

            // Phase 9 : Ajouter les nouvelles contraintes check (sans les colonnes supprimées)
            await queryInterface.addConstraint('actions', {
                fields: ['location_type', 'location_other'],
                type: 'check',
                name: 'check_actions_location_columns',
                where: locationCheckConditions,
                transaction,
            });

            await queryInterface.addConstraint('actions_history', {
                fields: ['location_type', 'location_other'],
                type: 'check',
                name: 'check_actions_history_location_columns',
                where: locationCheckConditions,
                transaction,
            });
        } catch (error) {
            console.log(error);
            await transaction.rollback();
            throw error;
        }
        await transaction.commit();
    },

    async down() {
        // Cette migration ne peut pas être inversée car elle supprime des données
        // et des structures de base de données.
    },
};
