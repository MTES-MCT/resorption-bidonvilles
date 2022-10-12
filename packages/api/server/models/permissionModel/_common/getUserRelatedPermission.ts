const sequelize = require('#db/sequelize');

module.exports = async (feature, entity, userId, transaction = undefined) => {
    const rows = await sequelize.query(
        `SELECT
            upu.user_permission_id,
            upu.allow_all,
            upu.allowed,
            upo.allow_all AS org_allow_all,
            upo.allowed AS org_allowed,
            rp.allow_all AS role_allow_all,
            rp.allowed AS role_allowed
        FROM users u
        LEFT JOIN user_permissions upu ON (upu.fk_user = u.user_id AND upu.fk_feature = :feature AND upu.fk_entity = :entity)
        LEFT JOIN user_permissions upo ON (upo.fk_organization = u.fk_organization AND upo.fk_feature = :feature AND upo.fk_entity = :entity)
        LEFT JOIN role_permissions rp ON (rp.fk_role_regular = u.fk_role_regular AND rp.fk_feature = :feature AND rp.fk_entity = :entity)
        WHERE u.user_id = :userId`,
        {
            type: sequelize.QueryTypes.SELECT,
            replacements: {
                feature,
                entity,
                userId,
            },
            transaction,
        },
    );

    if (rows.length === 0) {
        return [null, null];
    }

    const {
        user_permission_id, allow_all, allowed, org_allow_all, org_allowed, role_allow_all, role_allowed,
    } = rows[0];

    let userPermission = null;
    if (user_permission_id !== null) {
        userPermission = {
            user_permission_id,
            allow_all,
            allowed,
        };
    }

    let defaultPermission = null;
    if (org_allowed !== null) {
        defaultPermission = {
            allowed: org_allowed,
            allow_all: org_allow_all,
        };
    } else if (role_allowed !== null) {
        defaultPermission = {
            allowed: role_allowed,
            allow_all: role_allow_all,
        };
    }

    return [userPermission, defaultPermission];
};
