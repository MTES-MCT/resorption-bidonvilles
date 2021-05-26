module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.createTable(
            'permissions',
            {
                permission_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                },
                fk_organization: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                fk_role_admin: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                fk_role_regular: {
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
                fk_geographic_level: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                created_at: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                },
                updated_at: {
                    type: Sequelize.DATE,
                    allowNull: true,
                    defaultValue: null,
                    onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
                },
            },
            {
                transaction,
            },
        )
            .then(() => queryInterface.addConstraint(
                'permissions',
                ['permission_id'],
                {
                    type: 'unique',
                    name: 'uk_feature',
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
                'permissions',
                ['fk_organization'],
                {
                    type: 'foreign key',
                    name: 'fk_permisions_organization',
                    references: {
                        table: 'organizations',
                        field: 'organization_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'cascade',
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
                'permissions',
                ['fk_role_regular'],
                {
                    type: 'foreign key',
                    name: 'fk_permisions_role_regular',
                    references: {
                        table: 'roles_regular',
                        field: 'role_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'cascade',
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
                'permissions',
                ['fk_role_admin'],
                {
                    type: 'foreign key',
                    name: 'fk_permisions_role_admin',
                    references: {
                        table: 'roles_admin',
                        field: 'role_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'cascade',
                    transaction,
                },
            ))
            .then(() => queryInterface.sequelize.query(
                `ALTER TABLE
                    "permissions"
                ADD CONSTRAINT "fk_permissions_feature"
                FOREIGN KEY (fk_feature, fk_entity)
                REFERENCES "features"(name, fk_entity)
                ON DELETE CASCADE
                ON UPDATE CASCADE`,
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
                'permissions',
                ['fk_geographic_level'],
                {
                    type: 'foreign key',
                    name: 'fk_permissions_geographic_level',
                    references: {
                        table: 'geographic_levels',
                        field: 'name',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'restrict',
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
            ))
            .then(() => queryInterface.addConstraint(
                'permissions',
                ['allowed', 'fk_geographic_level'],
                {
                    type: 'check',
                    name: 'check_geographic_level',
                    where: {
                        [Sequelize.Op.or]: [
                            {
                                [Sequelize.Op.and]: {
                                    allowed: { [Sequelize.Op.eq]: false },
                                    fk_geographic_level: { [Sequelize.Op.eq]: null },
                                },
                            },
                            {
                                [Sequelize.Op.and]: {
                                    allowed: { [Sequelize.Op.eq]: true },
                                    fk_geographic_level: { [Sequelize.Op.ne]: null },
                                },
                            },
                        ],
                    },
                    transaction,
                },
            )),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.removeConstraint(
            'permissions',
            'uk_feature',
            {
                transaction,
            },
        )
            .then(() => queryInterface.removeConstraint(
                'permissions',
                'fk_permisions_organization',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeConstraint(
                'permissions',
                'fk_permisions_role_regular',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeConstraint(
                'permissions',
                'fk_permisions_role_admin',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeConstraint(
                'permissions',
                'fk_permissions_feature',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeConstraint(
                'permissions',
                'fk_permissions_geographic_level',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeConstraint(
                'permissions',
                'check_featurable',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeConstraint(
                'permissions',
                'check_geographic_level',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.dropTable('permissions', { transaction })),
    ),

};
