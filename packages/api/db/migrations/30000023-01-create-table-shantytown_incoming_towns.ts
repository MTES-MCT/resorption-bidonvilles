module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        await queryInterface.createTable(
            'shantytown_incoming_towns',
            {
                fk_shantytown: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    allowNull: false,
                },
                fk_incoming_town: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    allowNull: false,
                },
                created_at: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                },
            },
            { transaction },
        );

        await Promise.all([
            queryInterface.addConstraint(
                'shantytown_incoming_towns', {
                    fields: ['fk_shantytown'],
                    type: 'foreign key',
                    name: 'fk_shantytown_incoming_towns__original_town',
                    references: {
                        table: 'shantytowns',
                        field: 'shantytown_id',
                    },
                    onDelete: 'cascade',
                    onUpdate: 'cascade',
                    transaction,
                },
            ),
            queryInterface.addConstraint(
                'shantytown_incoming_towns', {
                    fields: ['fk_incoming_town'],
                    type: 'foreign key',
                    name: 'fk_shantytown_incoming_towns__incoming_town',
                    references: {
                        table: 'shantytowns',
                        field: 'shantytown_id',
                    },
                    onDelete: 'restrict',
                    onUpdate: 'cascade',
                    transaction,
                },
            ),
            queryInterface.addConstraint(
                'shantytown_incoming_towns', {
                    fields: ['fk_shantytown', 'fk_incoming_town'],
                    type: 'check',
                    name: 'check_town_does_not_reference_self',
                    where: {
                        fk_shantytown: { [Sequelize.Op.ne]: Sequelize.col('fk_incoming_town') },
                    },
                    transaction,
                },
            ),
        ]);

        return transaction.commit();
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();
        await Promise.all([
            queryInterface.removeConstraint(
                'shantytown_incoming_towns',
                'check_town_does_not_reference_self',
                { transaction },
            ),
            queryInterface.removeConstraint(
                'shantytown_incoming_towns',
                'fk_shantytown_incoming_towns__incoming_town',
                { transaction },
            ),
            queryInterface.removeConstraint(
                'shantytown_incoming_towns',
                'fk_shantytown_incoming_towns__original_town',
                { transaction },
            ),
        ]);
        await queryInterface.dropTable('shantytown_incoming_towns', { transaction });
        return transaction.commit();
    },
};
