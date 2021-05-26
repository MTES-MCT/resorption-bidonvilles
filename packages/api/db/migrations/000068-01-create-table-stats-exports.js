module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.createTable(
            'stats_exports',
            {
                closed_shantytowns: {
                    type: Sequelize.BOOLEAN,
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
                exported_by: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
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
                'stats_exports',
                ['exported_by'],
                {
                    type: 'foreign key',
                    name: 'fk_statsExports_exportedBy',
                    references: {
                        table: 'users',
                        field: 'user_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'restrict',
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
                'stats_exports',
                ['fk_region'],
                {
                    type: 'foreign key',
                    name: 'fk_statsExports_region',
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
                'stats_exports',
                ['fk_departement'],
                {
                    type: 'foreign key',
                    name: 'fk_statsExports_departement',
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
                'stats_exports',
                ['fk_epci'],
                {
                    type: 'foreign key',
                    name: 'fk_statsExports_epci',
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
                'stats_exports',
                ['fk_city'],
                {
                    type: 'foreign key',
                    name: 'fk_statsExports_city',
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
                'stats_exports',
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
            'stats_exports',
            'fk_statsExports_exportedBy',
            {
                transaction,
            },
        )
            .then(() => queryInterface.removeConstraint(
                'stats_exports',
                'fk_statsExports_region',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeConstraint(
                'stats_exports',
                'fk_statsExports_departement',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeConstraint(
                'stats_exports',
                'fk_statsExports_epci',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeConstraint(
                'stats_exports',
                'fk_statsExports_city',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeConstraint(
                'stats_exports',
                'check_location',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.dropTable('stats_exports', { transaction })),
    ),

};
