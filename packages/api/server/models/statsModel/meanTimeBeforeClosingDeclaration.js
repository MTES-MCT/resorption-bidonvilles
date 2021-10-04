const { sequelize } = require('#db/models');

module.exports = async () => {
    const rows = await sequelize.query(
        `SELECT
            AVG(diff) AS average,
            percentile_disc(0.5) within group (ORDER BY diff) AS median
        FROM (SELECT
                shantytowns.closed_at AS d,
                EXTRACT(days from COALESCE(h1."archivedAt", shantytowns.updated_at) - shantytowns.closed_at) AS diff
            FROM shantytowns
            LEFT JOIN "ShantytownHistories" h1 ON h1.hid = (
                SELECT
                    hid
                FROM
                    "ShantytownHistories" h2
                WHERE
                    h2.shantytown_id = shantytowns.shantytown_id
                    AND
                    h2.closed_at = shantytowns.closed_at
                ORDER BY h2."archivedAt" ASC
                LIMIT 1
            )
            WHERE shantytowns.closed_at IS NOT NULL
        ) t
        WHERE
            d >= '2019-09-01'::date /* date of official opening to actual users */
        `,
        {
            type: sequelize.QueryTypes.SELECT,
        },
    );

    return rows[0];
};
