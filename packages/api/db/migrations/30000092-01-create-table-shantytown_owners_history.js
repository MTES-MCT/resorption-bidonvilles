const { addForeignKey, removeForeignKey } = require('./common/helpers/manageForeignKeys');

module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            const definition = {
                shantytown_parcel_owner_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                fk_shantytown: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                fk_user: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                owner_name: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                fk_owner_type: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                active: {
                    type: Sequelize.BOOLEAN,
                    allowNull: false,
                },
                created_at: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                },
            };

            await queryInterface.createTable(
                'shantytown_parcel_owners_history',
                {
                    ...definition,
                    archived_at: {
                        type: Sequelize.DATE,
                        allowNull: false,
                        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                    },
                },
                { transaction },
            );

            await Promise.all([
                addForeignKey(queryInterface, {
                    table: 'shantytown_parcel_owners_history',
                    fields: ['fk_shantytown'],
                    refTable: 'ShantytownHistories',
                    refField: 'hid',
                    onUpdate: 'cascade',
                    onDelete: 'cascade',
                    transaction,
                }),
                addForeignKey(queryInterface, {
                    table: 'shantytown_parcel_owners_history',
                    fields: ['fk_owner'],
                    refTable: 'shantytown_parcel_owners',
                    refField: 'owner_id',
                    onUpdate: 'cascade',
                    onDelete: 'cascade',
                    transaction,
                }),
                addForeignKey(queryInterface, {
                    table: 'shantytown_parcel_owners_history',
                    fields: ['fk_owner_type'],
                    refTable: 'owner_types',
                    refField: 'owner_type_id',
                    onUpdate: 'cascade',
                    onDelete: 'cascade',
                    transaction,
                }),
            ]);

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await Promise.all([
                removeForeignKey(queryInterface, {
                    table: 'shantytown_parcel_owners_history',
                    refTable: 'ShantytownHistories',
                    transaction,
                }),
                removeForeignKey(queryInterface, {
                    table: 'shantytown_parcel_owners_history',
                    refTable: 'shantytown_parcel_owners',
                    transaction,
                }),
                removeForeignKey(queryInterface, {
                    table: 'shantytown_parcel_owners_history',
                    refTable: 'owner_types',
                    transaction,
                }),
                removeForeignKey(queryInterface, {
                    table: 'shantytown_parcel_owners_history',
                    refTable: 'users',
                    transaction,
                }),
            ]);

            await queryInterface.dropTable('shantytown_parcel_owners_history', { transaction });
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
