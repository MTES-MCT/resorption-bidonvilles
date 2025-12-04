const { addForeignKey, removeForeignKey } = require('./common/helpers/manageForeignKeys');

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

            await addForeignKey(queryInterface, {
                table: 'land_registry_enquiries',
                fields: ['fk_user'],
                refTable: 'users',
                refField: 'user_id',
                onUpdate: 'cascade',
                onDelete: 'cascade',
                transaction,
            });
            await addForeignKey(queryInterface, {
                table: 'land_registry_enquiries',
                fields: ['fk_organization'],
                refTable: 'organizations',
                refField: 'organization_id',
                onUpdate: 'cascade',
                onDelete: 'cascade',
                transaction,
            });

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
            await removeForeignKey(queryInterface, {
                table: 'land_registry_enquiries',
                refTable: 'users',
                transaction,
            });
            await removeForeignKey(queryInterface, {
                table: 'land_registry_enquiries',
                refTable: 'organizations',
                transaction,
            });
            await queryInterface.dropTable('land_registry_enquiries', { transaction });
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
