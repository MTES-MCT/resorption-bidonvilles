const { addForeignKey, removeForeignKey } = require('./common/helpers/manageForeignKeys');

module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await queryInterface.createTable(
                'shantytown_parcel_owners',
                {
                    shantytown_parcel_owner_id: {
                        type: Sequelize.INTEGER,
                        allowNull: false,
                        autoIncrement: true,
                        primaryKey: true,
                    },
                    fk_shantytown: {
                        type: Sequelize.INTEGER,
                        allowNull: false,
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
                        defaultValue: true,
                    },
                    created_at: {
                        type: Sequelize.DATE,
                        allowNull: false,
                        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                    },
                },
                { transaction },
            );

            const foreignKeys = [
                {
                    fields: ['fk_user'],
                    refTable: 'users',
                    refField: 'user_id',
                },
                {
                    fields: ['fk_shantytown'],
                    refTable: 'shantytowns',
                    refField: 'shantytown_id',
                },
                {
                    fields: ['fk_owner_type'],
                    refTable: 'owner_types',
                    refField: 'owner_type_id',
                },
            ];

            await Promise.all(
                foreignKeys.map(fk => addForeignKey(queryInterface, {
                    table: 'shantytown_parcel_owners',
                    onUpdate: 'cascade',
                    onDelete: 'cascade',
                    transaction,
                    ...fk,
                })),
            );

            await queryInterface.addIndex(
                'shantytown_parcel_owners',
                ['fk_shantytown'],
                {
                    name: 'id__shantytown_parcel_owners__fk_shantytown',
                    using: 'BTREE',
                    schema: 'public',
                    transaction,
                },
            );
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await Promise.all(
                ['users', 'shantytowns', 'owner_types'].map(refTable => removeForeignKey(queryInterface, {
                    table: 'shantytown_parcel_owners',
                    refTable,
                    transaction,
                })),
            );
            await queryInterface.dropTable('shantytown_parcel_owners', { transaction });
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
