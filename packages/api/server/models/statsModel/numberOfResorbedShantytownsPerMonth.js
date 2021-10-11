const { sequelize } = require('#db/models');
const convertToDateMapping = require('./_common/convertToDateMapping');

module.exports = async (departement = null, startDateStr = '2019-06-01') => {
    const rows = await sequelize.query(
        `SELECT 
            EXTRACT(YEAR FROM shantytowns.closed_at) AS year,
            EXTRACT(MONTH FROM shantytowns.closed_at) AS month,
            COUNT(*) AS total
        FROM shantytowns LEFT JOIN cities AS city ON shantytowns.fk_city = city.code
        WHERE
            closed_at > '${startDateStr}'
            AND
            closed_with_solutions = 'yes'
            ${departement ? `AND fk_departement = '${departement}'` : ''}
        GROUP BY year, month
        ORDER BY year ASC ,month ASC`,
        {
            type: sequelize.QueryTypes.SELECT,
        },
    );

    return convertToDateMapping(rows, new Date(startDateStr));
};
