// actions
module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            const rows = await queryInterface.sequelize.query(
                `
                SELECT fk_action, fk_organization FROM (
                    SELECT fk_action, fk_user FROM action_managers
                    UNION
                    SELECT fk_action, fk_user FROM action_operators
                ) t
                LEFT JOIN users ON t.fk_user = users.user_id
                GROUP BY fk_action, fk_organization
                `,
                {
                    type: queryInterface.sequelize.QueryTypes.SELECT,
                    transaction,
                },
            );

            const hash = rows.reduce((acc, row) => {
                if (!acc[row.fk_organization]) {
                    acc[row.fk_organization] = [];
                }

                acc[row.fk_organization].push(row.fk_action);
                return acc;
            }, {});

            if (Object.keys(hash).length > 0) {
                await queryInterface.bulkInsert(
                    'user_permissions',
                    Object.keys(hash).map(organizationId => [
                        {
                            fk_organization: organizationId,
                            fk_feature: 'read',
                            fk_entity: 'action',
                            allowed: true,
                            allow_all: false,
                            is_cumulative: true,
                        },
                        {
                            fk_organization: organizationId,
                            fk_feature: 'update',
                            fk_entity: 'action',
                            allowed: true,
                            allow_all: false,
                            is_cumulative: true,
                        },
                        {
                            fk_organization: organizationId,
                            fk_feature: 'read',
                            fk_entity: 'action_comment',
                            allowed: true,
                            allow_all: false,
                            is_cumulative: true,
                        },
                        {
                            fk_organization: organizationId,
                            fk_feature: 'create',
                            fk_entity: 'action_comment',
                            allowed: true,
                            allow_all: false,
                            is_cumulative: true,
                        },
                    ]).flat(),
                    { transaction },
                );

                const permissionIds = await queryInterface.sequelize.query(
                    `SELECT
                        user_permission_id,
                        fk_organization
                    FROM user_permissions
                    WHERE fk_entity IN ('action', 'action_comment')`,
                    {
                        type: queryInterface.sequelize.QueryTypes.SELECT,
                        transaction,
                    },
                );

                if (permissionIds.length > 0) {
                    await queryInterface.bulkInsert(
                        'user_permission_attachments',
                        permissionIds.map(({ user_permission_id, fk_organization }) => hash[fk_organization].map(action_id => ({
                            fk_user_permission: user_permission_id,
                            fk_action: action_id,
                        }))).flat(),
                        { transaction },
                    );
                }
            }

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
