// actions
module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            const rows = await queryInterface.sequelize.query(
                `
                SELECT * FROM (
                    SELECT fk_action, fk_user FROM action_managers
                    UNION
                    SELECT fk_action, fk_user FROM action_operators
                ) t
                GROUP BY fk_action, fk_user
                `,
                {
                    type: queryInterface.sequelize.QueryTypes.SELECT,
                    transaction,
                },
            );

            const hash = rows.reduce((acc, row) => {
                if (!acc[row.fk_user]) {
                    acc[row.fk_user] = [];
                }

                acc[row.fk_user].push(row.fk_action);
                return acc;
            }, {});

            await queryInterface.bulkInsert(
                'user_permissions',
                Object.keys(hash).map(userId => [
                    {
                        fk_user: userId,
                        fk_feature: 'read',
                        fk_entity: 'action',
                        allowed: true,
                        allow_all: false,
                        is_cumulative: false,
                    },
                    {
                        fk_user: userId,
                        fk_feature: 'update',
                        fk_entity: 'action',
                        allowed: true,
                        allow_all: false,
                        is_cumulative: false,
                    },
                    {
                        fk_user: userId,
                        fk_feature: 'read',
                        fk_entity: 'action_comment',
                        allowed: true,
                        allow_all: false,
                        is_cumulative: false,
                    },
                    {
                        fk_user: userId,
                        fk_feature: 'create',
                        fk_entity: 'action_comment',
                        allowed: true,
                        allow_all: false,
                        is_cumulative: false,
                    },
                ]).flat(),
                { transaction },
            );

            const permissionIds = await queryInterface.sequelize.query(
                `SELECT
                    user_permission_id,
                    fk_user
                FROM user_permissions
                WHERE fk_entity IN ('action', 'action_comment')`,
                {
                    type: queryInterface.sequelize.QueryTypes.SELECT,
                    transaction,
                },
            );

            await queryInterface.bulkInsert(
                'user_permission_attachments',
                permissionIds.map(({ user_permission_id, fk_user }) => hash[fk_user].map(action_id => ({
                    fk_user_permission: user_permission_id,
                    fk_action: action_id,
                }))).flat(),
                { transaction },
            );

            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    down: async queryInterface => queryInterface.sequelize.query(
        'DELETE FROM user_permissions WHERE fk_entity IN (\'action\', \'action_comment\') IS NOT NULL',
    ),
};
