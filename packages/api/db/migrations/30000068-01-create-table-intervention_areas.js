module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await queryInterface.createTable(
                'intervention_areas',
                {
                    fk_organization: {
                        type: Sequelize.INTEGER,
                        allowNull: true,
                    },
                    fk_user: {
                        type: Sequelize.INTEGER,
                        allowNull: true,
                    },
                    is_main_area: {
                        type: Sequelize.BOOLEAN,
                        allowNull: false,
                        defaultValue: false,
                    },
                    type: {
                        type: Sequelize.ENUM('nation', 'region', 'departement', 'epci', 'city'),
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
                // clés étrangères
                queryInterface.addConstraint(
                    'intervention_areas', {
                        fields: ['fk_organization'],
                        type: 'foreign key',
                        name: 'fk__intervention_areas__organization',
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
                    'intervention_areas', {
                        fields: ['fk_user'],
                        type: 'foreign key',
                        name: 'fk__intervention_areas__user',
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
                    'intervention_areas', {
                        fields: ['fk_region'],
                        type: 'foreign key',
                        name: 'fk__intervention_areas__region',
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
                    'intervention_areas', {
                        fields: ['fk_departement'],
                        type: 'foreign key',
                        name: 'fk__intervention_areas__departement',
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
                    'intervention_areas', {
                        fields: ['fk_epci'],
                        type: 'foreign key',
                        name: 'fk__intervention_areas__epci',
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
                    'intervention_areas', {
                        fields: ['fk_city'],
                        type: 'foreign key',
                        name: 'fk__intervention_areas__city',
                        references: {
                            table: 'cities',
                            field: 'code',
                        },
                        onUpdate: 'cascade',
                        onDelete: 'cascade',
                        transaction,
                    },
                ),
                // contraintes d'unicité
                queryInterface.addConstraint(
                    'intervention_areas', {
                        fields: ['fk_organization', 'fk_region'],
                        type: 'unique',
                        name: 'uk__intervention_areas__no_duplicate_region_per_organization',
                        transaction,
                    },
                ),
                queryInterface.addConstraint(
                    'intervention_areas', {
                        fields: ['fk_organization', 'fk_departement'],
                        type: 'unique',
                        name: 'uk__intervention_areas__no_duplicate_departement_per_organization',
                        transaction,
                    },
                ),
                queryInterface.addConstraint(
                    'intervention_areas', {
                        fields: ['fk_organization', 'fk_epci'],
                        type: 'unique',
                        name: 'uk__intervention_areas__no_duplicate_epci_per_organization',
                        transaction,
                    },
                ),
                queryInterface.addConstraint(
                    'intervention_areas', {
                        fields: ['fk_organization', 'fk_city'],
                        type: 'unique',
                        name: 'uk__intervention_areas__no_duplicate_city_per_organization',
                        transaction,
                    },
                ),
                queryInterface.addConstraint(
                    'intervention_areas', {
                        fields: ['fk_user', 'fk_region'],
                        type: 'unique',
                        name: 'uk__intervention_areas__no_duplicate_region_per_user',
                        transaction,
                    },
                ),
                queryInterface.addConstraint(
                    'intervention_areas', {
                        fields: ['fk_user', 'fk_departement'],
                        type: 'unique',
                        name: 'uk__intervention_areas__no_duplicate_departement_per_user',
                        transaction,
                    },
                ),
                queryInterface.addConstraint(
                    'intervention_areas', {
                        fields: ['fk_user', 'fk_epci'],
                        type: 'unique',
                        name: 'uk__intervention_areas__no_duplicate_epci_per_user',
                        transaction,
                    },
                ),
                queryInterface.addConstraint(
                    'intervention_areas', {
                        fields: ['fk_user', 'fk_city'],
                        type: 'unique',
                        name: 'uk__intervention_areas__no_duplicate_city_per_user',
                        transaction,
                    },
                ),
                // contraintes de cohérence
                queryInterface.addConstraint(
                    'intervention_areas', {
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
                    'intervention_areas', {
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
                    'intervention_areas',
                    'must_have_one_and_only_one_territory',
                    {
                        transaction,
                    },
                ),
                queryInterface.removeConstraint(
                    'intervention_areas',
                    'must_be_either_for_organization_or_user_not_both',
                    { transaction },
                ),
                queryInterface.removeConstraint(
                    'intervention_areas',
                    'uk__intervention_areas__no_duplicate_region_per_user',
                    { transaction },
                ),
                queryInterface.removeConstraint(
                    'intervention_areas',
                    'uk__intervention_areas__no_duplicate_departement_per_user',
                    { transaction },
                ),
                queryInterface.removeConstraint(
                    'intervention_areas',
                    'uk__intervention_areas__no_duplicate_epci_per_user',
                    { transaction },
                ),
                queryInterface.removeConstraint(
                    'intervention_areas',
                    'uk__intervention_areas__no_duplicate_city_per_user',
                    { transaction },
                ),
                queryInterface.removeConstraint(
                    'intervention_areas',
                    'uk__intervention_areas__no_duplicate_city_per_organization',
                    { transaction },
                ),
                queryInterface.removeConstraint(
                    'intervention_areas',
                    'uk__intervention_areas__no_duplicate_region_per_organization',
                    { transaction },
                ),
                queryInterface.removeConstraint(
                    'intervention_areas',
                    'uk__intervention_areas__no_duplicate_departement_per_organization',
                    { transaction },
                ),
                queryInterface.removeConstraint(
                    'intervention_areas',
                    'uk__intervention_areas__no_duplicate_epci_per_organization',
                    { transaction },
                ),
                queryInterface.removeConstraint(
                    'intervention_areas',
                    'fk__intervention_areas__city',
                    {
                        transaction,
                    },
                ),
                queryInterface.removeConstraint(
                    'intervention_areas',
                    'fk__intervention_areas__epci',
                    {
                        transaction,
                    },
                ),
                queryInterface.removeConstraint(
                    'intervention_areas',
                    'fk__intervention_areas__departement',
                    {
                        transaction,
                    },
                ),
                queryInterface.removeConstraint(
                    'intervention_areas',
                    'fk__intervention_areas__region',
                    {
                        transaction,
                    },
                ),
                queryInterface.removeConstraint(
                    'intervention_areas',
                    'fk__intervention_areas__user',
                    { transaction },
                ),
                queryInterface.removeConstraint(
                    'intervention_areas',
                    'fk__intervention_areas__organization',
                    {
                        transaction,
                    },
                ),
            ]);
            await queryInterface.dropTable('intervention_areas', { transaction });

            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
