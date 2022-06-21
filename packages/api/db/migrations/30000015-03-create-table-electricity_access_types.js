

module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        // create tables
        const definition = {
            fk_shantytown: {
                type: Sequelize.INTEGER,
                primaryKey: true,
            },
            electricity_access_type: {
                type: Sequelize.ENUM('electrogene', 'reseau_urbain', 'installation_du_bati'),
                allowNull: false,
                primaryKey: true,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        };
        await Promise.all([
            queryInterface.createTable('electricity_access_types', definition, { transaction }),
            queryInterface.createTable('electricity_access_types_history', {
                ...definition,
                archived_at: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                },
            }, { transaction }),
        ]);

        // create foreign keys
        const constraint = (table, field) => ({
            type: 'foreign key',
            name: 'fk_electricity_access_types_shantytown',
            references: {
                table,
                field,
            },
            onUpdate: 'cascade',
            onDelete: 'cascade',
            transaction,
        });
        await Promise.all([
            queryInterface.addConstraint(
                'electricity_access_types',
                ['fk_shantytown'],
                constraint('shantytowns', 'shantytown_id'),
            ),
            queryInterface.addConstraint(
                'electricity_access_types_history',
                ['fk_shantytown'],
                constraint('ShantytownHistories', 'hid'),
            ),
        ]);

        await transaction.commit();
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        // remove foreign keys
        await Promise.all([
            queryInterface.removeConstraint(
                'electricity_access_types',
                'fk_electricity_access_types_shantytown',
                { transaction },
            ),
            queryInterface.removeConstraint(
                'electricity_access_types_history',
                'fk_electricity_access_types_shantytown',
                { transaction },
            ),
        ]);

        // remove table
        await Promise.all([
            queryInterface.dropTable('electricity_access_types', { transaction }),
            queryInterface.dropTable('electricity_access_types_history', { transaction }),
        ]);

        await transaction.commit();
    },
};
