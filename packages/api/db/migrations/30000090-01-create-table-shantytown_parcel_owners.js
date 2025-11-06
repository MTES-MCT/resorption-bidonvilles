const { addForeignKey, removeForeignKey } = require('./common/manageForeignKeys');

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

            await addForeignKey(queryInterface, 'shantytown_parcel_owners', ['fk_user'], 'users', 'user_id', 'cascade', 'cascade', transaction);
            await addForeignKey(queryInterface, 'shantytown_parcel_owners', ['fk_shantytown'], 'shantytowns', 'shantytown_id', 'cascade', 'cascade', transaction);
            await addForeignKey(queryInterface, 'shantytown_parcel_owners', ['fk_owner_type'], 'owner_types', 'owner_type_id', 'cascade', 'cascade', transaction);

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
            await removeForeignKey(queryInterface, 'shantytown_parcel_owners', 'users', transaction);
            await removeForeignKey(queryInterface, 'shantytown_parcel_owners', 'shantytowns', transaction);
            await removeForeignKey(queryInterface, 'shantytown_parcel_owners', 'owner_types', transaction);
            await queryInterface.dropTable('shantytown_parcel_owners', { transaction });
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
