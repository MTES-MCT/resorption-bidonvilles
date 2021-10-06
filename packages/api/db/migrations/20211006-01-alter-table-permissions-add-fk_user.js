module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.removeConstraint(
            'permissions',
            'check_featurable',
            { transaction },
        )
            .then(() => queryInterface.addColumn(
                'permissions',
                'fk_user',
                {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
                'permissions',
                ['fk_user'],
                {
                    type: 'foreign key',
                    name: 'fk_permissions_user',
                    references: {
                        table: 'users',
                        field: 'user_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'cascade',
                    transaction,
                },
            ))
            .then(() => queryInterface.sequelize.query(
                `INSERT INTO permissions(fk_user, fk_feature, fk_entity, allowed, fk_geographic_level)
                SELECT u.user_id AS fk_user, p.fk_feature, p.fk_entity, p.allowed, p.fk_geographic_level
                FROM permissions p
                LEFT JOIN users u ON u.fk_organization = p.fk_organization
                WHERE p.fk_organization IS NOT NULL AND u.user_id IS NOT NULL`,
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.sequelize.query(
                'DELETE FROM permissions WHERE fk_organization IS NOT NULL',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
                'permissions',
                ['fk_user', 'fk_role_admin', 'fk_role_regular'],
                {
                    type: 'check',
                    name: 'check_featurable',
                    where: {
                        [Sequelize.Op.or]: [
                            {
                                [Sequelize.Op.and]: {
                                    fk_user: { [Sequelize.Op.ne]: null },
                                    fk_role_admin: { [Sequelize.Op.eq]: null },
                                    fk_role_regular: { [Sequelize.Op.eq]: null },
                                },
                            },
                            {
                                [Sequelize.Op.and]: {
                                    fk_user: { [Sequelize.Op.eq]: null },
                                    fk_role_admin: { [Sequelize.Op.ne]: null },
                                    fk_role_regular: { [Sequelize.Op.eq]: null },
                                },
                            },
                            {
                                [Sequelize.Op.and]: {
                                    fk_user: { [Sequelize.Op.eq]: null },
                                    fk_role_admin: { [Sequelize.Op.eq]: null },
                                    fk_role_regular: { [Sequelize.Op.ne]: null },
                                },
                            },
                        ],
                    },
                    transaction,
                },
            )),
    ),

    down: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.removeConstraint(
            'permissions',
            'check_featurable',
            { transaction },
        )
            .then(() => queryInterface.sequelize.query(
                `INSERT INTO permissions(fk_organization, fk_feature, fk_entity, allowed, fk_geographic_level)
                SELECT
                    fk_organization,
                    fk_feature,
                    fk_entity,
                    allowed,
                    fk_geographic_level
                FROM (
                    WITH total_permissions AS (SELECT fk_user, COUNT(*) AS total FROM permissions GROUP BY fk_user)
                    SELECT
                        RANK() OVER(
                        PARTITION BY u.fk_organization ORDER BY cp.total DESC, u.user_id ASC
                        ) AS "rank",
                        u.fk_organization,
                        p.fk_feature,
                        p.fk_entity,
                        p.allowed,
                        p.fk_geographic_level
                    FROM permissions p
                    LEFT JOIN total_permissions cp ON cp.fk_user = p.fk_user
                    LEFT JOIN users u ON p.fk_user = u.user_id
                    WHERE p.fk_user IS NOT NULL
                ) t
                WHERE "rank" = 1`,
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.sequelize.query(
                'DELETE FROM permissions WHERE fk_user IS NOT NULL',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeConstraint(
                'permissions',
                'fk_permissions_user',
                { transaction },
            ))
            .then(() => queryInterface.removeColumn(
                'permissions',
                'fk_user',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
                'permissions',
                ['fk_organization', 'fk_role_admin', 'fk_role_regular'],
                {
                    type: 'check',
                    name: 'check_featurable',
                    where: {
                        [Sequelize.Op.or]: [
                            {
                                [Sequelize.Op.and]: {
                                    fk_organization: { [Sequelize.Op.ne]: null },
                                    fk_role_admin: { [Sequelize.Op.eq]: null },
                                    fk_role_regular: { [Sequelize.Op.eq]: null },
                                },
                            },
                            {
                                [Sequelize.Op.and]: {
                                    fk_organization: { [Sequelize.Op.eq]: null },
                                    fk_role_admin: { [Sequelize.Op.ne]: null },
                                    fk_role_regular: { [Sequelize.Op.eq]: null },
                                },
                            },
                            {
                                [Sequelize.Op.and]: {
                                    fk_organization: { [Sequelize.Op.eq]: null },
                                    fk_role_admin: { [Sequelize.Op.eq]: null },
                                    fk_role_regular: { [Sequelize.Op.ne]: null },
                                },
                            },
                        ],
                    },
                    transaction,
                },
            )),
    ),

};
