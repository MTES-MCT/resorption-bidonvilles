async function insertPermissionWithAttachment(queryInterface, transaction, feature, userId, organizationId, planIds) {
    const [[{ user_permission_id: fk_permission }]] = await queryInterface.sequelize.query(
        `INSERT INTO user_permissions (fk_user, fk_organization, fk_feature, fk_entity, allowed, allow_all, is_cumulative)
        VALUES (:fk_user, :fk_organization, :feature, 'plan', true, false, true)
        RETURNING user_permission_id`,
        {
            transaction,
            replacements: {
                feature,
                fk_user: userId,
                fk_organization: organizationId,
            },
        },
    );

    return Promise.all(
        planIds.map(planId => queryInterface.sequelize.query(
            `INSERT INTO user_permission_attachments(fk_user_permission, fk_plan)
            VALUES (:fk_permission, :fk_plan)`,
            {
                transaction,
                replacements: {
                    fk_permission,
                    fk_plan: planId,
                },
            },
        )),
    );
}

module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        // on récupère la liste des pilotes (users) et des opérateurs (organizations)
        const [managers, operators] = await Promise.all([
            queryInterface.sequelize.query(
                'SELECT fk_user, ARRAY_AGG(fk_plan) AS "planIds" FROM plan_managers GROUP BY fk_user',
                {
                    type: queryInterface.sequelize.QueryTypes.SELECT,
                    transaction,
                },
            ),
            queryInterface.sequelize.query(
                `SELECT users.fk_organization, array_agg(DISTINCT plan_operators.fk_plan) AS "planIds"
                FROM plan_operators
                LEFT JOIN users ON plan_operators.fk_user = users.user_id
                GROUP BY users.fk_organization`,
                {
                    type: queryInterface.sequelize.QueryTypes.SELECT,
                    transaction,
                },
            ),
        ]);

        // on insère les permissions idoines
        await Promise.all([
            // pour les pilotes
            ...managers.map(({ fk_user, planIds }) => [
                insertPermissionWithAttachment(queryInterface, transaction, 'update', fk_user, null, planIds),
                insertPermissionWithAttachment(queryInterface, transaction, 'close', fk_user, null, planIds),
            ]).flat(),

            // pour les opérateurs
            ...operators.map(({ fk_organization, planIds }) => insertPermissionWithAttachment(
                queryInterface,
                transaction,
                'updateMarks',
                null,
                fk_organization,
                planIds,
            )),
        ]);

        return transaction.commit();
    },

    async down(queryInterface) {
        return queryInterface.sequelize.query('DELETE FROM user_permissions');
    },
};
