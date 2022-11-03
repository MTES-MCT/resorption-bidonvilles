module.exports = {
    up: (queryInterface, Sequelize) => Promise.all([
        queryInterface.addColumn(
            'shantytowns',
            'status_tmp',
            {
                type: Sequelize.STRING,
            },
        ),
        queryInterface.addColumn(
            'ShantytownHistories',
            'status_tmp',
            {
                type: Sequelize.STRING,
            },
        ),
    ])
        .then(() => Promise.all([
            queryInterface.sequelize.query('UPDATE shantytowns SET status_tmp = status'),
            queryInterface.sequelize.query('UPDATE "ShantytownHistories" SET status_tmp = status'),
        ]))
        .then(() => Promise.all([
            queryInterface.sequelize.query('ALTER TABLE shantytowns DROP COLUMN status'),
            queryInterface.sequelize.query('ALTER TABLE "ShantytownHistories" DROP COLUMN status'),
        ]))
        .then(() => Promise.all([
            queryInterface.sequelize.query('DROP TYPE "enum_shantytowns_status"'),
            queryInterface.sequelize.query('DROP TYPE "enum_ShantytownHistories_status"'),
        ]))
        .then(() => Promise.all([
            queryInterface.addColumn(
                'shantytowns',
                'status',
                {
                    type: Sequelize.STRING,
                },
            ),
            queryInterface.addColumn(
                'ShantytownHistories',
                'status',
                {
                    type: Sequelize.STRING,
                },
            ),
        ]))
        .then(() => Promise.all([
            queryInterface.sequelize.query('UPDATE shantytowns SET status = status_tmp'),
            queryInterface.sequelize.query('UPDATE "ShantytownHistories" SET status = status_tmp'),
        ]))
        .then(() => Promise.all([
            queryInterface.sequelize.query('ALTER TABLE shantytowns DROP COLUMN status_tmp'),
            queryInterface.sequelize.query('ALTER TABLE "ShantytownHistories" DROP COLUMN status_tmp'),
        ])),

    down: () => Promise.resolve(null),
};
