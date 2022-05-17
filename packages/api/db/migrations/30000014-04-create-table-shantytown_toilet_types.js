

module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        // create tables
        const definition = {
            fk_shantytown: {
                type: Sequelize.INTEGER,
                primaryKey: true,
            },
            toilet_type: {
                type: Sequelize.ENUM('latrines', 'toilettes_chimiques', 'toilettes_seches', 'toilettes_a_chasse'),
                allowNull: false,
                primaryKey: true,
            },
        };
        await Promise.all([
            queryInterface.createTable('shantytown_toilet_types', definition, { transaction }),
            queryInterface.createTable('shantytown_toilet_types_history', definition, { transaction }),
        ]);

        // create foreign keys
        const constraint = (table, field) => ({
            type: 'foreign key',
            name: 'fk_shantytown_toilet_types_shantytown',
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
                'shantytown_toilet_types',
                ['fk_shantytown'],
                constraint('shantytowns', 'shantytown_id'),
            ),
            queryInterface.addConstraint(
                'shantytown_toilet_types_history',
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
                'shantytown_toilet_types',
                'fk_shantytown_toilet_types_shantytown',
                { transaction },
            ),
            queryInterface.removeConstraint(
                'shantytown_toilet_types_history',
                'fk_shantytown_toilet_types_shantytown',
                { transaction },
            ),
        ]);

        // remove table
        await Promise.all([
            queryInterface.dropTable('shantytown_toilet_types', { transaction }),
            queryInterface.dropTable('shantytown_toilet_types_history', { transaction }),
        ]);

        await transaction.commit();
    },
};
