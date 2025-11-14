const { addForeignKey, removeForeignKey } = require('./common/manageForeignKeys');

module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await queryInterface.createTable(
                'land_registry_enquiries',
                {
                    enquiry_id: {
                        type: Sequelize.INTEGER,
                        allowNull: false,
                        autoIncrement: true,
                        primaryKey: true,
                    },
                    fk_user: {
                        type: Sequelize.INTEGER,
                        allowNull: false,
                    },
                    fk_organization: {
                        type: Sequelize.INTEGER,
                        allowNull: false,
                    },
                    fk_parcel: {
                        type: Sequelize.STRING,
                        allowNull: false,
                    },
                    created_at: {
                        type: Sequelize.DATE,
                        allowNull: false,
                    },
                },
                { transaction },
            );

            await addForeignKey(queryInterface, 'land_registry_enquiries', ['fk_user'], 'users', 'user_id', 'cascade', 'cascade', transaction);
            await addForeignKey(queryInterface, 'land_registry_enquiries', ['fk_organization'], 'organizations', 'organization_id', 'cascade', 'cascade', transaction);

            await queryInterface.addIndex(
                'land_registry_enquiries',
                ['fk_parcel'],
                {
                    name: 'id__land_registry_enquiries__fk_parcel',
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
            await removeForeignKey(queryInterface, 'land_registry_enquiries', 'users', transaction);
            await removeForeignKey(queryInterface, 'land_registry_enquiries', 'organizations', transaction);
            await queryInterface.dropTable('land_registry_enquiries', { transaction });
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
