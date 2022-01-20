module.exports = {

    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        // on crée une nouvelle table `role_permissions`
        await queryInterface.createTable(
            'role_permissions',
            {
                role_permission_id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                fk_role_regular: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                fk_role_admin: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                fk_feature: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                fk_entity: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                allowed: {
                    type: Sequelize.BOOLEAN,
                    allowNull: false,
                },
                allow_all: {
                    type: Sequelize.BOOLEAN,
                    allowNull: true,
                },
            },
            { transaction },
        );

        // on crée les clés étrangères
        await Promise.all([
            queryInterface.addConstraint(
                'role_permissions',
                ['fk_role_regular'],
                {
                    type: 'foreign key',
                    name: 'fk_role_permissions_role_regular',
                    references: {
                        table: 'roles_regular',
                        field: 'role_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'cascade',
                    transaction,
                },
            ),
            queryInterface.addConstraint(
                'role_permissions',
                ['fk_role_admin'],
                {
                    type: 'foreign key',
                    name: 'fk_role_permissions_role_admin',
                    references: {
                        table: 'roles_admin',
                        field: 'role_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'cascade',
                    transaction,
                },
            ),
            queryInterface.sequelize.query(
                `ALTER TABLE
                    "role_permissions"
                ADD CONSTRAINT "fk_role_permissions_feature"
                FOREIGN KEY (fk_feature, fk_entity)
                REFERENCES "features"(name, fk_entity)
                ON DELETE CASCADE
                ON UPDATE CASCADE`,
                {
                    transaction,
                },
            ),
        ]);

        // on s'assure qu'un et un seul role est défini
        await queryInterface.addConstraint(
            'role_permissions',
            ['fk_role_regular', 'fk_role_admin'],
            {
                type: 'check',
                name: 'check_role_regular_xor_role_admin',
                where: {
                    [Sequelize.Op.or]: [
                        {
                            [Sequelize.Op.and]: {
                                fk_role_regular: { [Sequelize.Op.eq]: null },
                                fk_role_admin: { [Sequelize.Op.ne]: null },
                            },
                        },
                        {
                            [Sequelize.Op.and]: {
                                fk_role_regular: { [Sequelize.Op.ne]: null },
                                fk_role_admin: { [Sequelize.Op.eq]: null },
                            },
                        },
                    ],
                },
                transaction,
            },
        );

        // on s'assure que allow_all est vide (null) quand elle est inutile
        await queryInterface.addConstraint(
            'role_permissions',
            ['allow_all'],
            {
                type: 'check',
                name: 'check_allow_all_is_null',
                where: {
                    [Sequelize.Op.or]: [
                        // allowed est false => allow_all est null
                        {
                            [Sequelize.Op.and]: {
                                allowed: { [Sequelize.Op.eq]: false },
                                allow_all: { [Sequelize.Op.eq]: null },
                            },
                        },
                        // allowed est true => allow_all n'est pas null
                        {
                            [Sequelize.Op.and]: {
                                allowed: { [Sequelize.Op.eq]: true },
                                allow_all: { [Sequelize.Op.ne]: null },
                            },
                        },
                    ],
                },
                transaction,
            },
        );

        // on s'assure qu'un même rôle ne peut pas avoir deux lignes de permission pour la même feature
        await Promise.all([
            queryInterface.addConstraint(
                'role_permissions',
                ['fk_role_regular', 'fk_feature', 'fk_entity'],
                {
                    type: 'unique',
                    name: 'uk_role_permissions_regular_feature_unicity',
                    transaction,
                },
            ),
            queryInterface.addConstraint(
                'role_permissions',
                ['fk_role_admin', 'fk_feature', 'fk_entity'],
                {
                    type: 'unique',
                    name: 'uk_role_permissions_admin_feature_unicity',
                    transaction,
                },
            ),
        ]);

        // on peuple la table sur la base de la table `permissions` (en ignorant les permissions 'own')
        await queryInterface.bulkInsert(
            'role_permissions',
            await queryInterface.sequelize.query(
                `SELECT
                    fk_role_regular,
                    fk_role_admin,
                    fk_feature,
                    fk_entity,
                    allowed,
                    CASE
                        WHEN fk_geographic_level = 'nation' THEN TRUE
                        ELSE FALSE
                    END AS allow_all
                FROM permissions
                WHERE   (fk_role_admin IS NOT NULL OR fk_role_regular IS NOT NULL)
                    AND (fk_geographic_level IN ('local', 'nation') OR fk_geographic_level IS NULL)
                ORDER BY fk_role_regular ASC, fk_role_admin ASC, fk_entity ASC, fk_feature ASC`,
                {
                    type: queryInterface.sequelize.QueryTypes.SELECT,
                    transaction,
                },
            ),
            { transaction },
        );

        return transaction.commit();
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        // on supprime les contraintes de la table
        await Promise.all([
            queryInterface.removeConstraint('role_permissions', 'fk_role_permissions_role_regular', { transaction }),
            queryInterface.removeConstraint('role_permissions', 'fk_role_permissions_role_admin', { transaction }),
            queryInterface.removeConstraint('role_permissions', 'fk_role_permissions_feature', { transaction }),
            queryInterface.removeConstraint('role_permissions', 'check_role_regular_xor_role_admin', { transaction }),
            queryInterface.removeConstraint('role_permissions', 'check_allow_all_is_null', { transaction }),
            queryInterface.removeConstraint('role_permissions', 'uk_role_permissions_regular_feature_unicity', { transaction }),
            queryInterface.removeConstraint('role_permissions', 'uk_role_permissions_admin_feature_unicity', { transaction }),
        ]);

        // on supprime la table
        await queryInterface.dropTable('role_permissions', { transaction });

        return transaction.commit();
    },

};
