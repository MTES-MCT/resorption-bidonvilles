module.exports = {
    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.removeConstraint(
            'ShantytownClosingSolutionHistories',
            'fk_shantytown_closing_solutions_shantytown',
            {
                transaction,
            },
        )
            .then(() => queryInterface.sequelize.query(
                `SELECT sh.hid AS "townHid", scsh.hid AS "solutionHid"
                FROM "ShantytownClosingSolutionHistories" scsh
                LEFT JOIN "ShantytownHistories" sh ON scsh.fk_shantytown = sh.shantytown_id
                WHERE scsh.updated_at - sh.updated_at < '00:00:05' AND scsh.updated_at - sh.updated_at > '-00:00:05'`,
                {
                    type: queryInterface.sequelize.QueryTypes.SELECT,
                    transaction,
                },
            ))
            .then(rows => Promise.all(
                rows.map(({ townHid, solutionHid }) => queryInterface.sequelize.query(
                    'UPDATE "ShantytownClosingSolutionHistories" SET fk_shantytown = :townHid WHERE hid = :solutionHid',
                    {
                        replacements: { townHid, solutionHid },
                        transaction,
                    },
                )),
            ))
            .then(() => queryInterface.addConstraint('ShantytownClosingSolutionHistories', ['fk_shantytown'], {
                type: 'foreign key',
                name: 'fk_shantytown_closing_solutions_shantytown',
                references: {
                    table: 'ShantytownHistories',
                    field: 'hid',
                },
                onUpdate: 'cascade',
                onDelete: 'cascade',
                transaction,
            })),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.removeConstraint(
            'ShantytownClosingSolutionHistories',
            'fk_shantytown_closing_solutions_shantytown',
            {
                transaction,
            },
        )
            .then(() => queryInterface.sequelize.query(
                `SELECT sh.shantytown_id AS "townId", scsh.hid AS "solutionHid"
                FROM "ShantytownClosingSolutionHistories" scsh
                LEFT JOIN "ShantytownHistories" sh ON scsh.fk_shantytown = sh.hid`,
                {
                    type: queryInterface.sequelize.QueryTypes.SELECT,
                    transaction,
                },
            ))
            .then(rows => Promise.all(
                rows.map(({ townId, solutionHid }) => queryInterface.sequelize.query(
                    'UPDATE "ShantytownClosingSolutionHistories" SET fk_shantytown = :townId WHERE hid = :solutionHid',
                    {
                        replacements: { townId, solutionHid },
                        transaction,
                    },
                )),
            ))
            .then(() => queryInterface.addConstraint('ShantytownClosingSolutionHistories', ['fk_shantytown'], {
                type: 'foreign key',
                name: 'fk_shantytown_closing_solutions_shantytown',
                references: {
                    table: 'shantytowns',
                    field: 'shantytown_id',
                },
                onUpdate: 'cascade',
                onDelete: 'cascade',
                transaction,
            })),
    ),
};
