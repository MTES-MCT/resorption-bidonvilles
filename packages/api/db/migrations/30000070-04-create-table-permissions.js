module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await queryInterface.dropTable('permissions', { transaction });

            await queryInterface.createTable(
                'permissions',
                {
                    permission_id: {
                        type: Sequelize.INTEGER,
                        allowNull: false,
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
                    type: {
                        type: Sequelize.ENUM('nation', 'region', 'departement', 'epci', 'city'),
                        allowNull: true,
                    },
                    fk_region: {
                        type: Sequelize.STRING,
                        allowNull: true,
                    },
                    fk_departement: {
                        type: Sequelize.STRING,
                        allowNull: true,
                    },
                    fk_epci: {
                        type: Sequelize.STRING,
                        allowNull: true,
                    },
                    fk_city: {
                        type: Sequelize.STRING,
                        allowNull: true,
                    },
                    created_at: {
                        type: Sequelize.DATE,
                        allowNull: false,
                        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                    },
                },
                { transaction },
            );

            await Promise.all([
                // clés étrangères
                queryInterface.addConstraint('permissions', {
                    fields: ['fk_user'],
                    type: 'foreign key',
                    name: 'fk_permissions__user',
                    references: {
                        table: 'users',
                        field: 'user_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'cascade',
                    transaction,
                }),
                queryInterface.addConstraint('permissions', {
                    fields: ['fk_organization'],
                    type: 'foreign key',
                    name: 'fk_permissions__organization',
                    references: {
                        table: 'organizations',
                        field: 'organization_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'cascade',
                    transaction,
                }),
                queryInterface.sequelize.query(
                    `ALTER TABLE
                        "permissions"
                    ADD CONSTRAINT "fk_permissions__feature"
                    FOREIGN KEY (fk_feature, fk_entity)
                    REFERENCES "features"(name, fk_entity)
                    ON DELETE CASCADE
                    ON UPDATE CASCADE`,
                    {
                        transaction,
                    },
                ),
                queryInterface.addConstraint('permissions', {
                    fields: ['fk_region'],
                    type: 'foreign key',
                    name: 'fk_permissions__region',
                    references: {
                        table: 'regions',
                        field: 'code',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'cascade',
                    transaction,
                }),
                queryInterface.addConstraint('permissions', {
                    fields: ['fk_departement'],
                    type: 'foreign key',
                    name: 'fk_permissions__departement',
                    references: {
                        table: 'departements',
                        field: 'code',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'cascade',
                    transaction,
                }),
                queryInterface.addConstraint('permissions', {
                    fields: ['fk_epci'],
                    type: 'foreign key',
                    name: 'fk_permissions__epci',
                    references: {
                        table: 'epci',
                        field: 'code',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'cascade',
                    transaction,
                }),
                queryInterface.addConstraint('permissions', {
                    fields: ['fk_city'],
                    type: 'foreign key',
                    name: 'fk_permissions__city',
                    references: {
                        table: 'cities',
                        field: 'code',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'cascade',
                    transaction,
                }),
                queryInterface.addIndex('permissions', {
                    fields: ['fk_user'],
                    transaction,
                }),
                queryInterface.addIndex('permissions', {
                    fields: ['fk_organization'],
                    transaction,
                }),
                queryInterface.addIndex('permissions', {
                    fields: ['fk_feature'],
                    transaction,
                }),
                queryInterface.addIndex('permissions', {
                    fields: ['fk_entity'],
                    transaction,
                }),
                queryInterface.addIndex('permissions', {
                    fields: ['fk_region'],
                    transaction,
                }),
                queryInterface.addIndex('permissions', {
                    fields: ['fk_departement'],
                    transaction,
                }),
                queryInterface.addIndex('permissions', {
                    fields: ['fk_epci'],
                    transaction,
                }),
                queryInterface.addIndex('permissions', {
                    fields: ['fk_city'],
                    transaction,
                }),
                // contraintes d'unicité
                queryInterface.addConstraint(
                    'permissions', {
                        fields: ['fk_organization', 'fk_region', 'fk_feature', 'fk_entity'],
                        type: 'unique',
                        name: 'uk_permissions__no_duplicate_region_per_organization',
                        transaction,
                    },
                ),
                queryInterface.addConstraint(
                    'permissions', {
                        fields: ['fk_organization', 'fk_departement', 'fk_feature', 'fk_entity'],
                        type: 'unique',
                        name: 'uk_permissions__no_duplicate_departement_per_organization',
                        transaction,
                    },
                ),
                queryInterface.addConstraint(
                    'permissions', {
                        fields: ['fk_organization', 'fk_epci', 'fk_feature', 'fk_entity'],
                        type: 'unique',
                        name: 'uk_permissions__no_duplicate_epci_per_organization',
                        transaction,
                    },
                ),
                queryInterface.addConstraint(
                    'permissions', {
                        fields: ['fk_organization', 'fk_city', 'fk_feature', 'fk_entity'],
                        type: 'unique',
                        name: 'uk_permissions__no_duplicate_city_per_organization',
                        transaction,
                    },
                ),
                queryInterface.addConstraint(
                    'permissions', {
                        fields: ['fk_user', 'fk_region', 'fk_feature', 'fk_entity'],
                        type: 'unique',
                        name: 'uk_permissions__no_duplicate_region_per_user',
                        transaction,
                    },
                ),
                queryInterface.addConstraint(
                    'permissions', {
                        fields: ['fk_user', 'fk_departement', 'fk_feature', 'fk_entity'],
                        type: 'unique',
                        name: 'uk_permissions__no_duplicate_departement_per_user',
                        transaction,
                    },
                ),
                queryInterface.addConstraint(
                    'permissions', {
                        fields: ['fk_user', 'fk_epci', 'fk_feature', 'fk_entity'],
                        type: 'unique',
                        name: 'uk_permissions__no_duplicate_epci_per_user',
                        transaction,
                    },
                ),
                queryInterface.addConstraint(
                    'permissions', {
                        fields: ['fk_user', 'fk_city', 'fk_feature', 'fk_entity'],
                        type: 'unique',
                        name: 'uk_permissions__no_duplicate_city_per_user',
                        transaction,
                    },
                ),
                // contraintes de cohérence
                queryInterface.addConstraint(
                    'permissions', {
                        fields: ['fk_organization', 'fk_user'],
                        type: 'check',
                        name: 'must_be_either_for_organization_or_user_not_both',
                        where: {
                            [Sequelize.Op.or]: [
                                {
                                    [Sequelize.Op.and]: {
                                        fk_user: { [Sequelize.Op.eq]: null },
                                        fk_organization: { [Sequelize.Op.ne]: null },
                                    },
                                },
                                {
                                    [Sequelize.Op.and]: {
                                        fk_user: { [Sequelize.Op.ne]: null },
                                        fk_organization: { [Sequelize.Op.eq]: null },
                                    },
                                },
                            ],
                        },
                        transaction,
                    },
                ),
                queryInterface.addConstraint(
                    'permissions', {
                        fields: ['type', 'fk_region', 'fk_departement', 'fk_epci', 'fk_city'],
                        type: 'check',
                        name: 'must_have_one_and_only_one_territory',
                        where: {
                            [Sequelize.Op.or]: [
                                {
                                    [Sequelize.Op.and]: {
                                        type: 'nation',
                                        fk_region: { [Sequelize.Op.eq]: null },
                                        fk_departement: { [Sequelize.Op.eq]: null },
                                        fk_epci: { [Sequelize.Op.eq]: null },
                                        fk_city: { [Sequelize.Op.eq]: null },
                                    },
                                },
                                {
                                    [Sequelize.Op.and]: {
                                        type: 'region',
                                        fk_region: { [Sequelize.Op.ne]: null },
                                        fk_departement: { [Sequelize.Op.eq]: null },
                                        fk_epci: { [Sequelize.Op.eq]: null },
                                        fk_city: { [Sequelize.Op.eq]: null },
                                    },
                                },
                                {
                                    [Sequelize.Op.and]: {
                                        type: 'departement',
                                        fk_region: { [Sequelize.Op.eq]: null },
                                        fk_departement: { [Sequelize.Op.ne]: null },
                                        fk_epci: { [Sequelize.Op.eq]: null },
                                        fk_city: { [Sequelize.Op.eq]: null },
                                    },
                                },
                                {
                                    [Sequelize.Op.and]: {
                                        type: 'epci',
                                        fk_region: { [Sequelize.Op.eq]: null },
                                        fk_departement: { [Sequelize.Op.eq]: null },
                                        fk_epci: { [Sequelize.Op.ne]: null },
                                        fk_city: { [Sequelize.Op.eq]: null },
                                    },
                                },
                                {
                                    [Sequelize.Op.and]: {
                                        type: 'city',
                                        fk_region: { [Sequelize.Op.eq]: null },
                                        fk_departement: { [Sequelize.Op.eq]: null },
                                        fk_epci: { [Sequelize.Op.eq]: null },
                                        fk_city: { [Sequelize.Op.ne]: null },
                                    },
                                },
                            ],
                        },
                        transaction,
                    },
                ),
            ]);

            return transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await Promise.all([
                queryInterface.removeConstraint('permissions', 'fk_permissions__user', { transaction }),
                queryInterface.removeConstraint('permissions', 'fk_permissions__organization', { transaction }),
                queryInterface.removeConstraint('permissions', 'fk_permissions__feature', { transaction }),
                queryInterface.removeConstraint('permissions', 'fk_permissions__region', { transaction }),
                queryInterface.removeConstraint('permissions', 'fk_permissions__departement', { transaction }),
                queryInterface.removeConstraint('permissions', 'fk_permissions__epci', { transaction }),
                queryInterface.removeConstraint('permissions', 'fk_permissions__city', { transaction }),
                queryInterface.removeConstraint('permissions', 'uk_permissions__no_duplicate_region_per_organization', { transaction }),
                queryInterface.removeConstraint('permissions', 'uk_permissions__no_duplicate_departement_per_organization', { transaction }),
                queryInterface.removeConstraint('permissions', 'uk_permissions__no_duplicate_epci_per_organization', { transaction }),
                queryInterface.removeConstraint('permissions', 'uk_permissions__no_duplicate_city_per_organization', { transaction }),
                queryInterface.removeConstraint('permissions', 'uk_permissions__no_duplicate_region_per_user', { transaction }),
                queryInterface.removeConstraint('permissions', 'uk_permissions__no_duplicate_departement_per_user', { transaction }),
                queryInterface.removeConstraint('permissions', 'uk_permissions__no_duplicate_epci_per_user', { transaction }),
                queryInterface.removeConstraint('permissions', 'uk_permissions__no_duplicate_city_per_user', { transaction }),
                queryInterface.removeConstraint('permissions', 'must_be_either_for_organization_or_user_not_both', { transaction }),
                queryInterface.removeConstraint('permissions', 'must_have_one_and_only_one_territory', { transaction }),
            ]);

            await queryInterface.dropTable('permissions', { transaction });

            return transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    },
};
