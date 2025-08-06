module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        async function addForeignKey(table, fields, refTable, refField, onUpdate, onDelete, pTransaction) {
            return queryInterface.addConstraint(table, {
                fields,
                type: 'foreign key',
                name: `fk__${table}__${refTable}`,
                references: {
                    table: `${refTable}`,
                    field: `${refField}`,
                },
                onUpdate: `${onUpdate}`,
                onDelete: `${onDelete}`,
                transaction: pTransaction,
            });
        }

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
                    },
                },
                { transaction },
            );

            await addForeignKey('shantytown_parcel_owners', ['fk_user'], 'users', 'user_id', 'cascade', 'cascade', transaction);
            await addForeignKey('shantytown_parcel_owners', ['fk_shantytown'], 'shantytowns', 'shantytown_id', 'cascade', 'cascade', transaction);
            await addForeignKey('shantytown_parcel_owners', ['fk_owner_type'], 'owner_types', 'owner_type_id', 'cascade', 'cascade', transaction);

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

        function removeForeignKey(table, refTable) {
            return queryInterface.removeConstraint(`${table}`, `fk__${table}__${refTable}`,
                { transaction });
        }

        try {
            await removeForeignKey('shantytown_parcel_owners', 'users');
            await removeForeignKey('shantytown_parcel_owners', 'shantytowns');
            await removeForeignKey('shantytown_parcel_owners', 'owner_types');
            await queryInterface.dropTable('shantytown_parcel_owners', { transaction });
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
