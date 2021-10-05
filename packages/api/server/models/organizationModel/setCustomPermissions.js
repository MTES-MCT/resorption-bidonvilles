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
            )),
        )),
);
