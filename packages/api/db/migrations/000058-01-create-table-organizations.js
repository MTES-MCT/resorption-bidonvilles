module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.createTable(
            'organizations',
            {
                organization_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                },
                name: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                abbreviation: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                active: {
                    type: Sequelize.BOOLEAN,
                    allowNull: false,
                },
                fk_type: {
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
                'organizations',
                ['fk_type'],
                {
                    type: 'foreign key',
                    name: 'fk_organizations_type',
                    references: {
                        table: 'organization_types',
                        field: 'organization_type_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'restrict',
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
                'organizations',
                ['fk_region'],
                {
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
            ))
            .then(() => queryInterface.addConstraint(
                'organizations',
                ['fk_departement'],
                {
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
            ))
            .then(() => queryInterface.addConstraint(
                'organizations',
                ['fk_epci'],
                {
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
            ))
            .then(() => queryInterface.addConstraint(
                'organizations',
                ['fk_city'],
                {
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
            ))
            .then(() => queryInterface.addConstraint(
                'organizations',
                ['fk_region', 'fk_departement', 'fk_epci', 'fk_city'],
                {
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
            )),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.removeConstraint(
            'organizations',
            'fk_organizations_type',
            {
                transaction,
            },
        )
            .then(() => queryInterface.removeConstraint(
                'organizations',
                'fk_organizations_region',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeConstraint(
                'organizations',
                'fk_organizations_departement',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeConstraint(
                'organizations',
                'fk_organizations_epci',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeConstraint(
                'organizations',
                'fk_organizations_city',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeConstraint(
                'organizations',
                'check_location',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.dropTable('organizations', { transaction })),
    ),

};
