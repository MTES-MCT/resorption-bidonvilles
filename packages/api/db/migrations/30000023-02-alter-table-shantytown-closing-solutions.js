const solution_correspondance = [
    { oldValues: ['Mise à l’abri / hébergement d’urgence (CHU)', 'Dispositif dédié (CADA, HUDA, CAO, CHUM, ARV, ...)'], newValue: 'Mise à l’abri temporaire (quelques jours ou semaines)' },
    { oldValues: ['Dispositif spécifique d’insertion au territoire', 'Hébergement d’insertion (CHRS, ALT)', 'Logement ordinaire ou adapté (résidences sociales, IML, pensions de famille, logements social ou privé accompagnés)'], newValue: 'Hébergement ou logement adapté longue durée avec accompagnement, dont espace terrain d’insertion' },
    { oldValues: ['Dispositifs de veille sociale ou sans solution'], newValue: 'Aucune' },
];


module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        // create temporary tables
        await queryInterface.createTable(
            'closing_solutions_temp',
            {
                closing_solution_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                },
                label: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                created_at: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                },
                updated_at: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                    onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
                },
            }, { transaction },
        );
        // populate closing_solutions_temp with new values
        await Promise.all(
            [

                queryInterface.bulkInsert(
                    'closing_solutions_temp',
                    [
                        { label: 'Mise à l’abri temporaire (quelques jours ou semaines)' },
                        { label: 'Hébergement ou logement adapté longue durée avec accompagnement, dont espace terrain d’insertion' },
                        { label: 'Logement' },
                        { label: 'Aucune' },
                        { label: 'Autre' },
                    ],
                    { transaction },
                ),
            ],
        );
        await Promise.all(
            [
                queryInterface.createTable(
                    'shantytown_closing_solutions_temp',
                    {
                        fk_shantytown: {
                            type: Sequelize.INTEGER,
                            allowNull: false,
                        },
                        fk_closing_solution: {
                            type: Sequelize.INTEGER,
                            allowNull: false,
                        },
                        number_of_people_affected: {
                            type: Sequelize.INTEGER,
                            allowNull: true,
                        },
                        number_of_households_affected: {
                            type: Sequelize.INTEGER,
                            allowNull: true,
                        },
                        message: {
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
                            allowNull: false,
                            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                            onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
                        },
                    },
                    { transaction },
                ),
            ],
        );
        // create constraints
        await Promise.all([
            queryInterface.addConstraint('closing_solutions_temp', ['label'], {
                type: 'unique',
                name: 'uk_closing_solutions_label_temp',
                transaction,
            }),
            queryInterface.addConstraint(
                'shantytown_closing_solutions_temp',
                ['fk_shantytown'],
                {
                    type: 'foreign key',
                    name: 'fk_shantytown_closing_solutions_shantytown_temp',
                    references: {
                        table: 'shantytowns',
                        field: 'shantytown_id',
                    },
                    onDelete: 'cascade',
                    onUpdate: 'cascade',
                    transaction,
                },
            ),
            queryInterface.addConstraint(
                'shantytown_closing_solutions_temp',
                ['fk_closing_solution'],
                {
                    type: 'foreign key',
                    name: 'fk_shantytown_closing_solutions_solution_temp',
                    references: {
                        table: 'closing_solutions_temp',
                        field: 'closing_solution_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'cascade',
                    transaction,
                },
            ),
            queryInterface.addConstraint('shantytown_closing_solutions_temp', ['fk_shantytown', 'fk_closing_solution'], {
                type: 'primary key',
                name: 'pk_shantytown_closing_solutions_temp',
                transaction,
            }),
        ]);

        // populate shantytown_closing_solutions with correspondance
        await Promise.all(solution_correspondance.map(correspondance => queryInterface.sequelize.query(
            `INSERT INTO shantytown_closing_solutions_temp
                    (fk_shantytown, fk_closing_solution, number_of_people_affected, number_of_households_affected)
                SELECT fk_shantytown, cst.closing_solution_id, SUM(number_of_people_affected), SUM(number_of_households_affected)
                FROM shantytown_closing_solutions scs
                LEFT JOIN closing_solutions cs ON cs.closing_solution_id = scs.fk_closing_solution
                LEFT JOIN closing_solutions_temp cst ON cst.label = '${correspondance.newValue}'
                WHERE cs.label IN ('${correspondance.oldValues.join('\', \'')}')
                GROUP BY fk_shantytown, cst.closing_solution_id
            `,
            { transaction },
        )));

        // drop old tables, rename new
        await Promise.all(
            [
                queryInterface.dropTable('ShantytownClosingSolutionHistories', { transaction }),
                queryInterface.dropTable('shantytown_closing_solutions', { transaction }),
                queryInterface.dropTable('closing_solutions', { transaction }),
                queryInterface.sequelize.query(
                    `ALTER TABLE shantytown_closing_solutions_temp
                    RENAME TO shantytown_closing_solutions
                    `,
                    { transaction },
                ),
                queryInterface.sequelize.query(
                    `ALTER TABLE closing_solutions_temp
                    RENAME TO closing_solutions
                    `,
                    { transaction },
                ),
            ],
        );

        await Promise.all(
            [

            ],
        );

        return transaction.commit();
    },


    async down(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        await Promise.all([
            queryInterface.dropTable('shantytown_closing_solutions', { transaction }),
            queryInterface.dropTable('closing_solutions', { transaction }),

        ]);

        // create tables closing_solutions, shantytown_closing_solutions and ShantytownClosingSolutionHistories
        await Promise.all(
            [
                queryInterface.createTable(
                    'closing_solutions',
                    {
                        closing_solution_id: {
                            type: Sequelize.INTEGER,
                            allowNull: false,
                            primaryKey: true,
                            autoIncrement: true,
                        },
                        label: {
                            type: Sequelize.STRING,
                            allowNull: false,
                        },
                        created_at: {
                            type: Sequelize.DATE,
                            allowNull: false,
                            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                        },
                        updated_at: {
                            type: Sequelize.DATE,
                            allowNull: false,
                            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                            onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
                        },
                    },
                    { transaction },
                ),

                queryInterface.createTable(
                    'shantytown_closing_solutions',
                    {
                        fk_shantytown: {
                            type: Sequelize.INTEGER,
                            allowNull: false,
                        },
                        fk_closing_solution: {
                            type: Sequelize.INTEGER,
                            allowNull: false,
                        },
                        number_of_people_affected: {
                            type: Sequelize.INTEGER,
                            allowNull: true,
                        },
                        number_of_households_affected: {
                            type: Sequelize.INTEGER,
                            allowNull: true,
                        },
                        created_at: {
                            type: Sequelize.DATE,
                            allowNull: false,
                            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                        },
                        updated_at: {
                            type: Sequelize.DATE,
                            allowNull: false,
                            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                            onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
                        },
                    },
                    { transaction },
                ),
                queryInterface.createTable(
                    'ShantytownClosingSolutionHistories',
                    {
                        hid: {
                            type: Sequelize.INTEGER,
                            allowNull: false,
                            primaryKey: true,
                            autoIncrement: true,
                        },
                        archivedAt: {
                            type: Sequelize.DATE,
                            allowNull: false,
                            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                        },
                        fk_shantytown: {
                            type: Sequelize.INTEGER,
                            allowNull: false,
                        },
                        fk_closing_solution: {
                            type: Sequelize.INTEGER,
                            allowNull: false,
                        },
                        number_of_people_affected: {
                            type: Sequelize.INTEGER,
                            allowNull: true,
                        },
                        number_of_households_affected: {
                            type: Sequelize.INTEGER,
                            allowNull: true,
                        },
                        created_at: {
                            type: Sequelize.DATE,
                            allowNull: false,
                            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                        },
                        updated_at: {
                            type: Sequelize.DATE,
                            allowNull: false,
                            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                            onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
                        },
                    },
                    { transaction },
                )],
        );


        // create constraints
        await Promise.all([
            queryInterface.addConstraint('closing_solutions', ['label'], {
                type: 'unique',
                name: 'uk_closing_solutions_label',
                transaction,
            }),
            queryInterface.addConstraint(
                'shantytown_closing_solutions',
                ['fk_shantytown'],
                {
                    type: 'foreign key',
                    name: 'fk_shantytown_closing_solutions_shantytown',
                    references: {
                        table: 'shantytowns',
                        field: 'shantytown_id',
                    },
                    onDelete: 'cascade',
                    onUpdate: 'cascade',
                    transaction,
                },
            ),
            queryInterface.addConstraint(
                'shantytown_closing_solutions',
                ['fk_closing_solution'],
                {
                    type: 'foreign key',
                    name: 'fk_shantytown_closing_solutions_solution',
                    references: {
                        table: 'closing_solutions',
                        field: 'closing_solution_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'cascade',
                    transaction,
                },
            ),
            queryInterface.addConstraint('shantytown_closing_solutions', ['fk_shantytown', 'fk_closing_solution'], {
                type: 'primary key',
                name: 'pk_shantytown_closing_solutions',
                transaction,
            }),
            queryInterface.addConstraint('ShantytownClosingSolutionHistories', ['fk_shantytown'], {
                type: 'foreign key',
                name: 'fk_shantytown_closing_solutions_shantytown',
                references: {
                    table: 'shantytowns',
                    field: 'shantytown_id',
                },
                onUpdate: 'cascade',
                onDelete: 'cascade',
                transaction,
            }),

            queryInterface.addConstraint('ShantytownClosingSolutionHistories', ['fk_closing_solution'], {
                type: 'foreign key',
                name: 'fk_shantytown_closing_solutions_solution',
                references: {
                    table: 'closing_solutions',
                    field: 'closing_solution_id',
                },
                onUpdate: 'cascade',
                onDelete: 'cascade',
                transaction,
            }),
            // populate closing_solutions with old values
            queryInterface.bulkInsert(
                'closing_solutions',
                [
                    { label: 'Mise à l’abri / hébergement d’urgence (CHU)' },
                    { label: 'Hébergement d’insertion (CHRS, ALT)' },
                    { label: 'Logement ordinaire ou adapté (résidences sociales, IML, pensions de famille, logements social ou privé accompagnés)' },
                    { label: 'Dispositif dédié (CADA, HUDA, CAO, CHUM, ARV, ...)' },
                    { label: 'Dispositif spécifique d’insertion au territoire' },
                    { label: 'Dispositifs de veille sociale ou sans solution' },

                ],
                { transaction },
            ),
        ]);


        return transaction.commit();
    },
};
