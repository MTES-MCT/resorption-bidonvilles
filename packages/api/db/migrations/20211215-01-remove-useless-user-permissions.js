module.exports = {
    // on retire toutes les permissions qui sont liées à un utilisateur alors qu'ils ont déjà cette permission via leur rôle regular
    up(queryInterface) {
        return queryInterface.sequelize.query(
            `DELETE FROM permissions WHERE permission_id IN (
                SELECT pu.permission_id
                FROM permissions pu
                LEFT JOIN users u ON pu.fk_user = u.user_id
                LEFT JOIN permissions p ON u.fk_role_regular = p.fk_role_regular AND p.fk_feature = pu.fk_feature AND p.fk_entity = pu.fk_entity
                WHERE   pu.fk_user IS NOT NULL
                    AND pu.allowed = p.allowed
                    AND ((pu.fk_geographic_level = p.fk_geographic_level) OR (pu.fk_geographic_level IS NULL AND p.fk_geographic_level IS NULL))
            )`,
        );
    },

    down() {
        return Promise.resolve();
    },
};
