const { sequelize } = require('#db/models');

module.exports = async () => {
    const rows = await sequelize.query(
        `SELECT
            AVG(diff) AS average,
            percentile_disc(0.5) within group (ORDER BY diff) AS median
        FROM
            (SELECT
                COALESCE(built_at, declared_at) AS d,
                EXTRACT(day from created_at - COALESCE(built_at, declared_at)) AS diff
            FROM shantytowns
            WHERE built_at IS NOT NULL OR declared_at IS NOT NULL) t
        WHERE
            d >= '2019-09-01'::date /* date of official opening to actual users */
        `,
        {
            type: sequelize.QueryTypes.SELECT,
        },
    );

    return rows[0];
};
