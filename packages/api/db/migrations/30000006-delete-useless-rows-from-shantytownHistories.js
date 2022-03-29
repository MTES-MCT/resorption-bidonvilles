// deletes rows in table Shantytownhistories corresponding to shantytowns that have been deleted in table shantytowns

module.exports = {
    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            'SELECT DISTINCT shantytown_id  FROM "ShantytownHistories" sh WHERE sh.shantytown_id NOT IN (SELECT shantytown_id FROM shantytowns)',
            { type: queryInterface.sequelize.QueryTypes.SELECT, transaction },
        )
            .then(shantytowns => Promise.all(shantytowns.map(({ shantytown_id }) => queryInterface.bulkDelete(
                '"ShantytownHistories"',
                {
                    shantytown_id,
                },
                {
                    transaction,
                },
            )))),
    ),


    down: () => Promise.resolve(),
};
