module.exports = {

    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        // on crée une nouvelle table `user_permissions`
        await queryInterface.createTable(
            'user_permissions',
            {
                user_permission_id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                fk_user: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                fk_organization: {
                    type: Sequelize.INTEGER,
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
                is_cumulative: {
                    type: Sequelize.BOOLEAN,
                    allowNull: true,
                },
            },
            { transaction },
        );

        // on crée les clés étrangères
        await Promise.all([
            queryInterface.addConstraint(
                'user_permissions', {
                    fields: ['fk_user'],
                    type: 'foreign key',
                    name: 'fk_user_permissions_user',
                    references: {
                        table: 'users',
                        field: 'user_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'cascade',
                    transaction,
                },
            ),
            queryInterface.addConstraint(
                'user_permissions', {
                    fields: ['fk_organization'],
                    type: 'foreign key',
                    name: 'fk_user_permissions_organization',
                    references: {
                        table: 'organizations',
                        field: 'organization_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'cascade',
                    transaction,
                },
            ),
            queryInterface.sequelize.query(
                `ALTER TABLE
                    "user_permissions"
                ADD CONSTRAINT "fk_user_permissions_feature"
                FOREIGN KEY (fk_feature, fk_entity)
                REFERENCES "features"(name, fk_entity)
                ON DELETE CASCADE
                ON UPDATE CASCADE`,
                {
                    transaction,
                },
            ),
        ]);

        // on s'assure que fk_user OU fk_organization est toujours renseigné (et jamais les deux en même temps)
        await queryInterface.addConstraint(
            'user_permissions', {
                fields: ['fk_user', 'fk_organization'],
                type: 'check',
                name: 'check_user_xor_organization_is_given',
                where: {
                    [Sequelize.Op.or]: [
                        // fk_user n'est pas null ET fk_organization est null
                        {
                            [Sequelize.Op.and]: {
                                fk_user: { [Sequelize.Op.ne]: null },
                                fk_organization: { [Sequelize.Op.eq]: null },
                            },
                        },
                        // fk_user est null ET fk_organization n'est pas null
                        {
                            [Sequelize.Op.and]: {
                                fk_user: { [Sequelize.Op.eq]: null },
                                fk_organization: { [Sequelize.Op.ne]: null },
                            },
                        },
                    ],
                },
                transaction,
            },
        );

        // on s'assure que allow_all est vide (null) quand elle est inutile
        await queryInterface.addConstraint(
            'user_permissions', {
                fields: ['allow_all'],
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

        // on s'assure que is_cumulative est vide (null) quand elle est inutile
        await queryInterface.addConstraint(
            'user_permissions', {
                fields: ['is_cumulative'],
                type: 'check',
                name: 'check_is_cumulative_is_null',
                where: {
                    [Sequelize.Op.or]: [
                        // allowed est false => is_cumulative est null
                        {
                            [Sequelize.Op.and]: {
                                allowed: { [Sequelize.Op.eq]: false },
                                is_cumulative: { [Sequelize.Op.eq]: null },
                            },
                        },
                        // allowed est true => is_cumulative n'est pas null
                        {
                            [Sequelize.Op.and]: {
                                allowed: { [Sequelize.Op.eq]: true },
                                is_cumulative: { [Sequelize.Op.ne]: null },
                            },
                        },
                    ],
                },
                transaction,
            },
        );

        // on s'assure qu'un même user/org ne peut pas avoir deux lignes de permission pour la même feature
        await Promise.all([
            queryInterface.addConstraint(
                'user_permissions', {
                    fields: ['fk_user', 'fk_feature', 'fk_entity'],
                    type: 'unique',
                    name: 'uk_role_permissions_user_feature_unicity',
                    transaction,
                },
            ),
            queryInterface.addConstraint(
                'user_permissions', {
                    fields: ['fk_organization', 'fk_feature', 'fk_entity'],
                    type: 'unique',
                    name: 'uk_role_permissions_organization_feature_unicity',
                    transaction,
                },
            ),
        ]);

        // on peuple la table sur la base de la table `permissions` (en ignorant les cas 'own')
        const permissions = await queryInterface.sequelize.query(
            `SELECT
                fk_user,
                fk_feature,
                fk_entity,
                allowed,
                CASE
                    WHEN allowed IS FALSE THEN NULL
                    WHEN fk_geographic_level = 'nation' THEN TRUE
                    ELSE FALSE
                END AS allow_all,
                CASE
                    WHEN allowed IS TRUE THEN TRUE
                    ELSE NULL
                END AS is_cumulative
            FROM permissions
            WHERE   fk_user IS NOT NULL
                AND (fk_geographic_level IN ('local', 'nation') OR fk_geographic_level IS NULL)
            ORDER BY fk_user ASC, fk_entity ASC, fk_feature ASC`,
            {
                type: queryInterface.sequelize.QueryTypes.SELECT,
                transaction,
            },
        );
        if (permissions.length > 0) {
            await queryInterface.bulkInsert(
                'user_permissions',
                permissions,
                { transaction },
            );
        }

        return transaction.commit();
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        // on supprime les contraintes de la table
        await Promise.all([
            queryInterface.removeConstraint('user_permissions', 'fk_user_permissions_user', { transaction }),
            queryInterface.removeConstraint('user_permissions', 'fk_user_permissions_organization', { transaction }),
            queryInterface.removeConstraint('user_permissions', 'fk_user_permissions_feature', { transaction }),
            queryInterface.removeConstraint('user_permissions', 'check_user_xor_organization_is_given', { transaction }),
            queryInterface.removeConstraint('user_permissions', 'check_allow_all_is_null', { transaction }),
            queryInterface.removeConstraint('user_permissions', 'check_is_cumulative_is_null', { transaction }),
            queryInterface.removeConstraint('user_permissions', 'uk_role_permissions_user_feature_unicity', { transaction }),
            queryInterface.removeConstraint('user_permissions', 'uk_role_permissions_organization_feature_unicity', { transaction }),
        ]);

        // on supprime la table
        await queryInterface.dropTable('user_permissions', { transaction });

        return transaction.commit();
    },

};
