const { createTableWithForeignKeys, dropTableWithForeignKeys } = require('./common/helpers/migrationHelper');

module.exports = {
    async up(queryInterface, Sequelize) {
        await createTableWithForeignKeys(queryInterface, {
            tableName: 'land_registry_enquiries',
            tableDefinition: {
                land_registry_enquiry_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                },
            // ... autres colonnes
            },
            foreignKeys: [
                {
                    fields: ['fk_user'],
                    refTable: 'users',
                    refField: 'user_id',
                },
                {
                    fields: ['fk_organization'],
                    refTable: 'organizations',
                    refField: 'organization_id',
                },
            ],
            indexes: [
                {
                    fields: ['fk_parcel'],
                    name: 'id__land_registry_enquiries__fk_parcel',
                },
            ],
        });
    },

    async down(queryInterface) {
        await dropTableWithForeignKeys(queryInterface, {
            tableName: 'land_registry_enquiries',
            refTables: ['users', 'organizations'],
        });
    },
};
