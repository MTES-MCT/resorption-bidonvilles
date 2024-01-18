module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await Promise.all([
                queryInterface.removeConstraint('organizations', 'fk_organizations_city', { transaction }),
                queryInterface.removeConstraint('organizations', 'fk_organizations_epci', { transaction }),
                queryInterface.removeConstraint('organizations', 'fk_organizations_departement', { transaction }),
                queryInterface.removeConstraint('organizations', 'fk_organizations_region', { transaction }),
                queryInterface.removeConstraint('organizations', 'check_location', { transaction }),
            ]);

            await Promise.all([
                queryInterface.removeColumn('organizations', 'fk_region', { transaction }),
                queryInterface.removeColumn('organizations', 'fk_departement', { transaction }),
                queryInterface.removeColumn('organizations', 'fk_epci', { transaction }),
                queryInterface.removeColumn('organizations', 'fk_city', { transaction }),
            ]);

            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    async down(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await Promise.all([
                queryInterface.addColumn('organizations', 'fk_region', {
                    type: Sequelize.STRING,
                    allowNull: true,
                }, { transaction }),
                queryInterface.addColumn('organizations', 'fk_departement', {
                    type: Sequelize.STRING,
                    allowNull: true,
                }, { transaction }),
                queryInterface.addColumn('organizations', 'fk_epci', {
                    type: Sequelize.STRING,
                    allowNull: true,
                }, { transaction }),
                queryInterface.addColumn('organizations', 'fk_city', {
                    type: Sequelize.STRING,
                    allowNull: true,
                }, { transaction }),
            ]);

            await Promise.all([
                queryInterface.addConstraint(
                    'organizations', {
                        fields: ['fk_region'],
                        type: 'foreign key',
                        name: 'fk_organizations_region',
                        references: {
                            table: 'regions',
                            field: 'code',
                        },
                        onUpdate: 'cascade',
                        onDelete: 'restrict',
                        transaction,
                    },
                ),
                queryInterface.addConstraint(
                    'organizations', {
                        fields: ['fk_departement'],
                        type: 'foreign key',
                        name: 'fk_organizations_departement',
                        references: {
                            table: 'departements',
                            field: 'code',
                        },
                        onUpdate: 'cascade',
                        onDelete: 'restrict',
                        transaction,
                    },
                ),
                queryInterface.addConstraint(
                    'organizations', {
                        fields: ['fk_epci'],
                        type: 'foreign key',
                        name: 'fk_organizations_epci',
                        references: {
                            table: 'epci',
                            field: 'code',
                        },
                        onUpdate: 'cascade',
                        onDelete: 'restrict',
                        transaction,
                    },
                ),
                queryInterface.addConstraint(
                    'organizations', {
                        fields: ['fk_city'],
                        type: 'foreign key',
                        name: 'fk_organizations_city',
                        references: {
                            table: 'cities',
                            field: 'code',
                        },
                        onUpdate: 'cascade',
                        onDelete: 'restrict',
                        transaction,
                    },
                ),
                queryInterface.addConstraint(
                    'organizations', {
                        fields: ['fk_region', 'fk_departement', 'fk_epci', 'fk_city'],
                        type: 'check',
                        name: 'check_location',
                        where: {
                            [Sequelize.Op.or]: [
                                {
                                    [Sequelize.Op.and]: {
                                        fk_region: { [Sequelize.Op.eq]: null },
                                        fk_departement: { [Sequelize.Op.eq]: null },
                                        fk_epci: { [Sequelize.Op.eq]: null },
                                        fk_city: { [Sequelize.Op.eq]: null },
                                    },
                                },
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

            // on repepeuple sur la base de intervention_areas
            await queryInterface.sequelize.query(
                `
                WITH new_values AS (
                    SELECT fk_organization, fk_region, fk_departement, fk_epci, fk_city FROM (
                        SELECT
                            fk_organization,
                            fk_region,
                            fk_departement,
                            fk_epci,
                            fk_city,
                            ROW_NUMBER() OVER(PARTITION BY fk_organization)
                        FROM intervention_areas
                        WHERE fk_organization IS NOT NULL
                    ) t
                    WHERE t.row_number = 1
                )

                UPDATE organizations
                SET
                    fk_region = new_values.fk_region,
                    fk_departement = new_values.fk_departement,
                    fk_epci = new_values.fk_epci,
                    fk_city = new_values.fk_city
                FROM new_values
                WHERE organizations.organization_id = new_values.fk_organization`,
                {
                    transaction,
                },
            );

            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
