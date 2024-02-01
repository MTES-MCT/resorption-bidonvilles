module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        await queryInterface.createTable(
            'plan_shantytowns_history',
            {
                fk_plan: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                fk_shantytown: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                created_by: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                created_at: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                },
                updated_by: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                    defaultValue: null,
                },
                updated_at: {
                    type: Sequelize.DATE,
                    allowNull: true,
                    defaultValue: null,
                    onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
                },
            },
            {
                transaction,
            },
        );

        await Promise.all([
            queryInterface.addConstraint(
                'plan_shantytowns_history', {
                    fields: ['fk_plan'],
                    type: 'foreign key',
                    name: 'fk_plan_shantytowns_history_plan',
                    references: {
                        table: 'plans_history',
                        field: 'hid',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'cascade',
                    transaction,
                },
            ),
            queryInterface.addConstraint(
                'plan_shantytowns_history', {
                    fields: ['fk_shantytown'],
                    type: 'foreign key',
                    name: 'fk_plan_shantytowns_history_shantytown',
                    references: {
                        table: 'shantytowns',
                        field: 'shantytown_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'cascade',
                    transaction,
                },
            ),
            queryInterface.addConstraint(
                'plan_shantytowns_history', {
                    fields: ['created_by'],
                    type: 'foreign key',
                    name: 'fk_plan_shantytowns_history_creator',
                    references: {
                        table: 'users',
                        field: 'user_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'restrict',
                    transaction,
                },
            ),
            queryInterface.addConstraint(
                'plan_shantytowns_history', {
                    fields: ['updated_by'],
                    type: 'foreign key',
                    name: 'fk_plan_shantytowns_history_editor',
                    references: {
                        table: 'users',
                        field: 'user_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'restrict',
                    transaction,
                },
            ),
        ]);

        // on peuple la table
        const data = await queryInterface.sequelize.query(
            `WITH plan_hids AS (
                SELECT plan_id, array_agg(hid) AS hids FROM plans_history GROUP BY plan_id
            )
            SELECT
                plan_hids.hids,
                plan_shantytowns.fk_shantytown,
                plan_shantytowns.created_by,
                plan_shantytowns.created_at,
                plan_shantytowns.updated_by,
                plan_shantytowns.updated_at
            FROM plan_shantytowns
            LEFT JOIN plan_hids ON plan_shantytowns.fk_plan = plan_hids.plan_id
            WHERE hids IS NOT NULL`,
            {
                type: queryInterface.sequelize.QueryTypes.SELECT,
                transaction,
            },
        );

        if (data.length > 0) {
            await queryInterface.bulkInsert(
                'plan_shantytowns_history',
                data
                    .map(
                        ({
                            hids, fk_shantytown, created_by, created_at, updated_by, updated_at,
                        }) => hids.map(hid => ({
                            fk_plan: hid,
                            fk_shantytown,
                            created_by,
                            created_at,
                            updated_by,
                            updated_at,
                        })),
                    )
                    .flat(),
                { transaction },
            );
        }

        return transaction.commit();
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        await Promise.all([
            queryInterface.removeConstraint(
                'plan_shantytowns_history',
                'fk_plan_shantytowns_history_editor',
                {
                    transaction,
                },
            ),
            queryInterface.removeConstraint(
                'plan_shantytowns_history',
                'fk_plan_shantytowns_history_creator',
                {
                    transaction,
                },
            ),
            queryInterface.removeConstraint(
                'plan_shantytowns_history',
                'fk_plan_shantytowns_history_shantytown',
                {
                    transaction,
                },
            ),
            queryInterface.removeConstraint(
                'plan_shantytowns_history',
                'fk_plan_shantytowns_history_plan',
                {
                    transaction,
                },
            ),
        ]);
        await queryInterface.dropTable('plan_shantytowns_history', { transaction });

        return transaction.commit();
    },
};
