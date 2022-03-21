const moment = require('moment');
const { sequelize } = require('#db/models');
const decomposeForDiagramm = require('./_common/decomposeForDiagramm');
const getArrayOfDates = require('./_common/getArrayOfDates');

module.exports = async () => {
    const date = new Date();
    const otherDate = new Date();
    otherDate.setMonth(date.getMonth() - 3);
    const shantytownStats = await sequelize.query(
        `SELECT 
            population_total as population,
            population_minors as minors,
            minors_in_school,
            shantytowns.updated_at,
            shantytowns.closed_at,
            resorbed,
            shantytowns.shantytown_id as id
        FROM (
            (SELECT updated_at, closed_at, CAST(closed_with_solutions AS text) as resorbed, shantytown_id, population_total, population_minors, minors_in_school FROM shantytowns)
            UNION
            (SELECT updated_at, closed_at, CAST(closed_with_solutions AS text) as resorbed, shantytown_id, population_total, population_minors, minors_in_school FROM "ShantytownHistories" sh
            WHERE sh.updated_at > '${moment(otherDate).format('YYYY-MM-DD HH:mm:ss ZZ')}' )
            ) shantytowns
        ORDER BY shantytowns.updated_at DESC`,
        {
            type: sequelize.QueryTypes.SELECT,
        },
    );

    const users = await sequelize.query(
        `SELECT 
            created_at
        FROM users
        WHERE fk_status = 'active'
        ORDER BY created_at DESC`,
        {
            type: sequelize.QueryTypes.SELECT,
        },
    );
    const listOfDates = getArrayOfDates(otherDate, date);
    const stats = decomposeForDiagramm(shantytownStats, users, listOfDates);
    return stats;
};
