const { createTableWithForeignKeys, dropTableWithForeignKeys } = require('./common/helpers/migrationHelper');

module.exports = {
    async up(queryInterface, Sequelize) {
        await createTableWithForeignKeys(queryInterface, {
            tableName: 'shantytown_parcel_owners',
            tableDefinition: {
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
            foreignKeys: [
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
            ],
            indexes: [
                {
                    fields: ['fk_shantytown'],
                    name: 'id__shantytown_parcel_owners__fk_shantytown',
                },
            ],
        });
    },

    async down(queryInterface) {
        await dropTableWithForeignKeys(queryInterface, {
            tableName: 'shantytown_parcel_owners',
            refTables: ['users', 'shantytowns', 'owner_types'],
        });
    },
};
