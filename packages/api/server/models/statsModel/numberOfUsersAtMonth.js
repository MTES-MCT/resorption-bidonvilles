const sequelize = require('#db/sequelize');

module.exports = async (date = '2020-06-01') => {
    const rows = await sequelize.query(
        `SELECT
            COUNT(*) AS total
            FROM user_accesses ua
        WHERE 
            ua.used_at IS NOT NULL
            AND
            ua.used_at < '${date}'`,
        {
            type: sequelize.QueryTypes.SELECT,
        },
    );

    return rows[0].total;
};
