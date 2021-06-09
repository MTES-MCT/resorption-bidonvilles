module.exports = {
    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.removeConstraint(
            'ShantytownOriginHistories',
            'fk_shantytown_origins_shantytown',
            {
                transaction,
            },
        )
            .then(() => queryInterface.sequelize.query(
                `SELECT sh.hid AS "townHid", soh.hid AS "originHid"
                FROM "ShantytownOriginHistories" soh
                LEFT JOIN "ShantytownHistories" sh ON soh.fk_shantytown = sh.shantytown_id
                WHERE soh.updated_at - sh.updated_at < '00:00:05' AND soh.updated_at - sh.updated_at > '-00:00:05'`,
                {
                    type: queryInterface.sequelize.QueryTypes.SELECT,
                    transaction,
                },
            ))
            .then(rows => Promise.all(
                rows.map(({ townHid, originHid }) => queryInterface.sequelize.query(
                    'UPDATE "ShantytownOriginHistories" SET fk_shantytown = :townHid WHERE hid = :originHid',
                    {
                        replacements: { townHid, originHid },
                        transaction,
                    },
                )),
            ))
            .then(() => queryInterface.addConstraint('ShantytownOriginHistories', ['fk_shantytown'], {
                type: 'foreign key',
                name: 'fk_shantytown_origins_shantytown',
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
            'ShantytownOriginHistories',
            'fk_shantytown_origins_shantytown',
            {
                transaction,
            },
        )
            .then(() => queryInterface.sequelize.query(
                `SELECT sh.shantytown_id AS "townId", soh.hid AS "originHid"
                FROM "ShantytownOriginHistories" soh
                LEFT JOIN "ShantytownHistories" sh ON soh.fk_shantytown = sh.hid`,
                {
                    type: queryInterface.sequelize.QueryTypes.SELECT,
                    transaction,
                },
            ))
            .then(rows => Promise.all(
                rows.map(({ townId, originHid }) => queryInterface.sequelize.query(
                    'UPDATE "ShantytownOriginHistories" SET fk_shantytown = :townId WHERE hid = :originHid',
                    {
                        replacements: { townId, originHid },
                        transaction,
                    },
                )),
            ))
            .then(() => queryInterface.addConstraint('ShantytownOriginHistories', ['fk_shantytown'], {
                type: 'foreign key',
                name: 'fk_shantytown_origins_shantytown',
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
