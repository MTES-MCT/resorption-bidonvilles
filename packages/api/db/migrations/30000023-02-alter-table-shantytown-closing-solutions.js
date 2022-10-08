
const oldValues = [
    'Mise à l’abri / hébergement d’urgence (CHU)',
    'Dispositif dédié (CADA, HUDA, CAO, CHUM, ARV, ...)',
    'Dispositif spécifique d’insertion au territoire',
    'Hébergement d’insertion (CHRS, ALT)',
    'Logement ordinaire ou adapté (résidences sociales, IML, pensions de famille, logements social ou privé accompagnés)',
    'Dispositifs de veille sociale ou sans solution',
];

const newValues = [
    'Mise à l’abri temporaire (quelques jours ou semaines)',
    'Hébergement ou logement adapté longue durée avec accompagnement, dont espace terrain d’insertion',
    'Logement',
    'Aucune',
    'Autre',
];

const solution_correspondance = [
    {
        oldValues:
            [
                'Mise à l’abri / hébergement d’urgence (CHU)',
                'Dispositif dédié (CADA, HUDA, CAO, CHUM, ARV, ...)',
            ],
        newValue: 'Mise à l’abri temporaire (quelques jours ou semaines)',
    },
    {
        oldValues:
            [
                'Dispositif spécifique d’insertion au territoire',
                'Hébergement d’insertion (CHRS, ALT)',
                'Logement ordinaire ou adapté (résidences sociales, IML, pensions de famille, logements social ou privé accompagnés)',
            ],
        newValue: 'Hébergement ou logement adapté longue durée avec accompagnement, dont espace terrain d’insertion',
    },
    {
        oldValues: ['Dispositifs de veille sociale ou sans solution'],
        newValue: 'Aucune',
    },
];


module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        await Promise.all(
            [
                // populate closing_solutions with new values
                queryInterface.bulkInsert(
                    'closing_solutions',
                    newValues.map(solution => ({ label: solution })),
                    { transaction },
                ),
                // add column message to shantytown_closing_solutions
                queryInterface.addColumn(
                    'shantytown_closing_solutions',
                    'message',
                    {
                        type: Sequelize.STRING,
                        allowNull: true,
                    },
                    {
                        transaction,
                    },
                ),
                // remove not used table
                queryInterface.dropTable('ShantytownClosingSolutionHistories', { transaction }),
            ],
        );

        // populate shantytown_closing_solutions with correspondance
        await Promise.all(solution_correspondance.map(correspondance => queryInterface.sequelize.query(
            `INSERT INTO shantytown_closing_solutions
                    (fk_shantytown, fk_closing_solution, number_of_people_affected, number_of_households_affected)
                WITH constantes(newClosingSolutionId) AS (
                    SELECT closing_solution_id FROM closing_solutions WHERE label = '${correspondance.newValue}'
                )
                SELECT scs.fk_shantytown, constantes.newClosingSolutionId, SUM(scs.number_of_people_affected), SUM(scs.number_of_households_affected)
                FROM shantytown_closing_solutions scs
                LEFT JOIN closing_solutions cs ON cs.closing_solution_id = scs.fk_closing_solution
                LEFT JOIN constantes ON true
                WHERE cs.label IN ('${correspondance.oldValues.join('\', \'')}')
                GROUP BY scs.fk_shantytown, constantes.newClosingSolutionId
            `,
            { transaction },
        )));

        await queryInterface.sequelize.query(
            `DELETE FROM shantytown_closing_solutions
            WHERE fk_closing_solution IN
                (
                    SELECT closing_solution_id 
                    FROM closing_solutions
                    WHERE label IN ('${oldValues.join('\', \'')}')
                )
            `,
            { transaction },
        );

        await queryInterface.sequelize.query(
            `DELETE FROM closing_solutions
            WHERE label IN ('${oldValues.join('\', \'')}')
            `,
            { transaction },
        );
        return transaction.commit();
    },


    async down(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        await Promise.all(
            [
                // create table ShantytownClosingSolutionHistories
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
                ),
                // delete column message in shantytown_closing_solutions
                queryInterface.removeColumn(
                    'shantytown_closing_solutions',
                    'message',
                    { transaction },
                ),
                // delete values in shantytown_closing_solutions
                queryInterface.sequelize.query(
                    'DELETE FROM shantytown_closing_solutions',
                    { transaction },
                ),
                // populate closing_solutions with old values
                queryInterface.bulkInsert(
                    'closing_solutions',
                    oldValues.map(solution => ({ label: solution })),
                    { transaction },
                ),
                // suppress new values
                queryInterface.sequelize.query(
                    `DELETE FROM closing_solutions
                    WHERE  label IN ('${newValues.join('\', \'')}')
                    `,
                    { transaction },
                ),
            ],
        );


        await Promise.all([
            // create constraints
            queryInterface.addConstraint('ShantytownClosingSolutionHistories', {
                fields: ['fk_shantytown'],
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

            queryInterface.addConstraint('ShantytownClosingSolutionHistories', {
                fields: ['fk_closing_solution'],
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

        ]);


        return transaction.commit();
    },
};
