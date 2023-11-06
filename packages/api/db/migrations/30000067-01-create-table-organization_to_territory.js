module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await queryInterface.createTable(
                'organization_to_territory',
                {
                    fk_organization: {
                        type: Sequelize.INTEGER,
                        allowNull: false,
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
                {
                    transaction,
                },
            );

            await Promise.all([
                queryInterface.addConstraint(
                    'organization_to_territory', {
                        fields: ['fk_organization'],
                        type: 'foreign key',
                        name: 'fk_organization_to_territory__organization',
                        references: {
                            table: 'organizations',
                            field: 'organization_id',
                        },
                        onUpdate: 'cascade',
                        onDelete: 'cascade',
                        transaction,
                    },
                ),
                queryInterface.addConstraint(
                    'organization_to_territory', {
                        fields: ['fk_region'],
                        type: 'foreign key',
                        name: 'fk_organization_to_territory__region',
                        references: {
                            table: 'regions',
                            field: 'code',
                        },
                        onUpdate: 'cascade',
                        onDelete: 'cascade',
                        transaction,
                    },
                ),
                queryInterface.addConstraint(
                    'organization_to_territory', {
                        fields: ['fk_departement'],
                        type: 'foreign key',
                        name: 'fk_organization_to_territory__departement',
                        references: {
                            table: 'departements',
                            field: 'code',
                        },
                        onUpdate: 'cascade',
                        onDelete: 'cascade',
                        transaction,
                    },
                ),
                queryInterface.addConstraint(
                    'organization_to_territory', {
                        fields: ['fk_epci'],
                        type: 'foreign key',
                        name: 'fk_organization_to_territory__epci',
                        references: {
                            table: 'epci',
                            field: 'code',
                        },
                        onUpdate: 'cascade',
                        onDelete: 'cascade',
                        transaction,
                    },
                ),
                queryInterface.addConstraint(
                    'organization_to_territory', {
                        fields: ['fk_city'],
                        type: 'foreign key',
                        name: 'fk_organization_to_territory__city',
                        references: {
                            table: 'cities',
                            field: 'code',
                        },
                        onUpdate: 'cascade',
                        onDelete: 'cascade',
                        transaction,
                    },
                ),
                queryInterface.addConstraint(
                    'organization_to_territory', {
                        fields: ['fk_organization', 'fk_region'],
                        type: 'unique',
                        name: 'uk_region',
                        transaction,
                    },
                ),
                queryInterface.addConstraint(
                    'organization_to_territory', {
                        fields: ['fk_organization', 'fk_departement'],
                        type: 'unique',
                        name: 'uk_departement',
                        transaction,
                    },
                ),
                queryInterface.addConstraint(
                    'organization_to_territory', {
                        fields: ['fk_organization', 'fk_epci'],
                        type: 'unique',
                        name: 'uk_epci',
                        transaction,
                    },
                ),
                queryInterface.addConstraint(
                    'organization_to_territory', {
                        fields: ['fk_organization', 'fk_city'],
                        type: 'unique',
                        name: 'uk_city',
                        transaction,
                    },
                ),
                queryInterface.addConstraint(
                    'organization_to_territory', {
                        fields: ['fk_region', 'fk_departement', 'fk_epci', 'fk_city'],
                        type: 'check',
                        name: 'must_have_one_and_only_one_territory',
                        where: {
                            [Sequelize.Op.or]: [
                                {
                                    [Sequelize.Op.and]: {
                                        fk_region: { [Sequelize.Op.ne]: null },
                                        fk_departement: { [Sequelize.Op.eq]: null },
                                        fk_epci: { [Sequelize.Op.eq]: null },
                                        fk_city: { [Sequelize.Op.eq]: null },
                                    },
                                },
                                {
                                    [Sequelize.Op.and]: {
                                        fk_region: { [Sequelize.Op.eq]: null },
                                        fk_departement: { [Sequelize.Op.ne]: null },
                                        fk_epci: { [Sequelize.Op.eq]: null },
                                        fk_city: { [Sequelize.Op.eq]: null },
                                    },
                                },
                                {
                                    [Sequelize.Op.and]: {
                                        fk_region: { [Sequelize.Op.eq]: null },
                                        fk_departement: { [Sequelize.Op.eq]: null },
                                        fk_epci: { [Sequelize.Op.ne]: null },
                                        fk_city: { [Sequelize.Op.eq]: null },
                                    },
                                },
                                {
                                    [Sequelize.Op.and]: {
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
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await Promise.all([
                queryInterface.removeConstraint(
                    'organization_to_territory',
                    'must_have_one_and_only_one_territory',
                    {
                        transaction,
                    },
                ),
                queryInterface.removeConstraint(
                    'organization_to_territory',
                    'uk_city',
                    {
                        transaction,
                    },
                ),
                queryInterface.removeConstraint(
                    'organization_to_territory',
                    'uk_epci',
                    {
                        transaction,
                    },
                ),
                queryInterface.removeConstraint(
                    'organization_to_territory',
                    'uk_departement',
                    {
                        transaction,
                    },
                ),
                queryInterface.removeConstraint(
                    'organization_to_territory',
                    'uk_region',
                    {
                        transaction,
                    },
                ),
                queryInterface.removeConstraint(
                    'organization_to_territory',
                    'fk_organization_to_territory__city',
                    {
                        transaction,
                    },
                ),
                queryInterface.removeConstraint(
                    'organization_to_territory',
                    'fk_organization_to_territory__epci',
                    {
                        transaction,
                    },
                ),
                queryInterface.removeConstraint(
                    'organization_to_territory',
                    'fk_organization_to_territory__departement',
                    {
                        transaction,
                    },
                ),
                queryInterface.removeConstraint(
                    'organization_to_territory',
                    'fk_organization_to_territory__region',
                    {
                        transaction,
                    },
                ),
                queryInterface.removeConstraint(
                    'organization_to_territory',
                    'fk_organization_to_territory__organization',
                    {
                        transaction,
                    },
                ),
            ]);
            await queryInterface.dropTable('organization_to_territory', { transaction });

            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
