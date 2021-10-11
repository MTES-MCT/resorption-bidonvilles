const { sequelize } = require('#db/models');

module.exports = async (organizationId, permissions) => sequelize.transaction(
    t => sequelize.query('DELETE FROM permissions WHERE fk_organization = :organizationId', {
        transaction: t,
        replacements: {
            organizationId,
        },
    })
        .then(() => Promise.all(
            permissions.map(permission => sequelize.query(
                `INSERT INTO
                            permissions(fk_organization, fk_role_admin, fk_role_regular, fk_feature, fk_entity, allowed, fk_geographic_level)
                        VALUES
                            (:organizationId, NULL, NULL, :feature, :entity, :allowed, :level)
                        RETURNING permission_id`,
                {
                    transaction: t,
                    replacements: {
                        organizationId,
                        feature: permission.feature,
                        entity: permission.entity,
                        level: permission.level,
                        allowed: permission.allowed,
                    },
                },
            )
                .then(([[{ permission_id: permissionId }]]) => {
                    const replacements = Object.assign({ fk_permission: permissionId }, permission.data || {});
                    return sequelize.query(
                        `INSERT INTO ${permission.entity}_permissions VALUES (${Object.keys(replacements).map(name => `:${name}`).join(',')})`,
                        {
                            transaction: t,
                            replacements,
                        },
                    );
                })),
        )),
);
