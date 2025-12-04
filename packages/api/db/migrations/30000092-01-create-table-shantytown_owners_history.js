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
                addForeignKey(
                    queryInterface,
                    'shantytown_parcel_owners_history',
                    ['fk_shantytown'],
                    'ShantytownHistories',
                    'hid',
                    'cascade',
                    'cascade',
                    transaction,
                ),
                addForeignKey(
                    queryInterface,
                    'shantytown_parcel_owners_history',
                    ['fk_owner_type'],
                    'owner_types',
                    'owner_type_id',
                    'cascade',
                    'cascade',
                    transaction,
                ),
                addForeignKey(
                    queryInterface,
                    'shantytown_parcel_owners_history',
                    ['fk_user'],
                    'users',
                    'user_id',
                    'cascade',
                    'cascade',
                    transaction,
                ),
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
                removeForeignKey(
                    queryInterface,
                    'shantytown_parcel_owners_history',
                    'ShantytownHistories',
                    transaction,
                ),
                removeForeignKey(
                    queryInterface,
                    'shantytown_parcel_owners_history',
                    'owner_types',
                    transaction,
                ),
                removeForeignKey(
                    queryInterface,
                    'shantytown_parcel_owners_history',
                    'users',
                    transaction,
                ),
            ]);

            await queryInterface.dropTable('shantytown_parcel_owners_history', { transaction });
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
