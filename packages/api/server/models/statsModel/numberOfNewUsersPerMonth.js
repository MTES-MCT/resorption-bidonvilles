const { sequelize } = require('#db/models');
const convertToDateMapping = require('./_common/convertToDateMapping');

module.exports = async (startDateStr = '2020-06-01') => {
    const startDate = new Date(startDateStr);
    const now = new Date();
    const limit = new Date(now.getFullYear(), now.getMonth() - 7, 1);

    const rows = await sequelize.query(
        `SELECT
            EXTRACT(YEAR FROM ua.used_at) AS year,
            EXTRACT(MONTH FROM ua.used_at) AS month,
            COUNT(*) AS total
        FROM user_accesses ua
        WHERE
            ua.used_at IS NOT NULL
            AND
            EXTRACT(EPOCH FROM ua.used_at) >= 10000
        GROUP BY year, month
        ORDER BY year ASC,month ASC`,
        {
            type: sequelize.QueryTypes.SELECT,
            replacements: {
                limit: limit.getTime() / 1000,
            },
        },
    );

    return convertToDateMapping(rows, startDate);
};
