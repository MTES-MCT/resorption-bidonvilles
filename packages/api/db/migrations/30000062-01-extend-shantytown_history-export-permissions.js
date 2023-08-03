const shantytownExportPermissionsRequest = `
    SELECT
        rp.fk_role_regular as "role_regular",
        rp.fk_role_admin as "role_admin",
        rp.fk_feature as "feature",
        rp.fk_entity as "entity",
        rp.allowed as "allowed",
        rp.allow_all as "allow_all"
    FROM
        role_permissions rp
    LEFT JOIN
        role_permissions rp2 
    ON
        rp.fk_role_regular = rp2.fk_role_regular
    AND 
        rp2.fk_feature = 'export'
    AND 
        rp2.fk_entity = 'shantytown_history'
    LEFT JOIN role_permissions rp3
    ON
        rp.fk_role_admin = rp3.fk_role_admin
    AND 
        rp3.fk_feature = 'export'
    AND 
        rp3.fk_entity = 'shantytown_history'
    WHERE 
        rp.fk_feature = 'export'
    AND
        rp.fk_entity = 'shantytown'
    AND
        rp2.role_permission_id IS NULL
    AND
        rp3.role_permission_id IS NULL`;

module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            const shantytownExportPermissions = await queryInterface.sequelize.query(
                shantytownExportPermissionsRequest,
                {
                    type: queryInterface.sequelize.QueryTypes.SELECT,
                    transaction,
                },
            );

            await Promise.all(shantytownExportPermissions.reduce((acc, permission) => {
                const regularKey = permission.role_regular !== null ? 'fkRoleRegular' : 'fkRoleAdmin';

                const query = `
                    INSERT INTO role_permissions (fk_role_regular, fk_role_admin, fk_feature, fk_entity, allowed, allow_all)
                    VALUES (${permission.role_regular !== null ? ':fkRoleRegular' : 'NULL'}, ${permission.role_regular !== null ? 'NULL' : ':fkRoleAdmin'}, :fkFeature, 'shantytown_history', :allowed, :allowAll)
                `;

                const replacements = {
                    [regularKey]: permission.role_regular !== null ? permission.role_regular : permission.role_admin,
                    fkFeature: permission.feature,
                    fkEntity: permission.entity,
                    allowed: permission.allowed,
                    allowAll: permission.allow_all,
                };

                acc.push(queryInterface.sequelize.query(query, {
                    transaction,
                    replacements,
                }));

                return acc;
            }, []));
            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    down: queryInterface => queryInterface.sequelize.query(
        "DELETE FROM role_permissions WHERE fk_entity = 'shantytown_history' AND fk_feature = 'export' AND (fk_role_admin NOT IN ('national_admin') OR fk_role_admin IS NULL)",
    ),
};
