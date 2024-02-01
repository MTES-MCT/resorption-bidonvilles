const { QueryTypes } = require('sequelize');

module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            const organizations = await queryInterface.sequelize.query(
                `SELECT u.fk_organization, array_agg(DISTINCT fk_action) AS actions
                FROM action_managers am
                LEFT JOIN users u ON u.user_id = am.fk_user 
                GROUP BY fk_organization`,
                {
                    transaction,
                    type: QueryTypes.SELECT,
                },
            );

            if (organizations.length > 0) {
                await queryInterface.bulkInsert(
                    'user_permissions',
                    organizations.map(organization => ({
                        fk_organization: organization.fk_organization, fk_feature: 'access', fk_entity: 'action_finances', allowed: true, allow_all: false,
                    })),
                    {
                        transaction,
                    },
                );
            }

            const permission_ids = await queryInterface.sequelize.query(
                'SELECT user_permission_id, fk_organization FROM user_permissions WHERE fk_feature = \'access\' AND fk_entity = \'action_finances\'',
                {
                    transaction,
                    type: QueryTypes.SELECT,
                },
            );

            const hash = permission_ids.reduce((acc, row) => {
                acc[row.fk_organization] = row.user_permission_id;
                return acc;
            }, {});

            if (organizations.length > 0) {
                await queryInterface.bulkInsert(
                    'user_permission_attachments',
                    organizations.map(organization => organization.actions.map(action => ({
                        fk_user_permission: hash[organization.fk_organization], fk_action: action,
                    }))).flat(),
                    {
                        transaction,
                    },
                );
            }

            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await queryInterface.sequelize.query(
                `DELETE FROM user_permission_attachments WHERE fk_user_permission IN 
                (SELECT user_permission_id FROM user_permissions WHERE fk_feature = 'access' AND fk_entity = 'action_finances')`,
                {
                    transaction,
                    type: QueryTypes.DELETE,
                },
            );

            await queryInterface.sequelize.query(
                'DELETE FROM user_permissions WHERE fk_feature = \'access\' AND fk_entity = \'action_finances\'',
                {
                    transaction,
                    type: QueryTypes.DELETE,
                },
            );


            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
