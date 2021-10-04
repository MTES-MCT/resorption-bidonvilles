const { sequelize } = require('#db/models');

module.exports = async (departement, date = '2020-06-01') => {
    const rows = await sequelize.query(
        `SELECT
            COUNT(*) AS total
        FROM shantytowns LEFT JOIN cities AS city ON shantytowns.fk_city = city.code
        WHERE 
            (shantytowns.created_at <= '${date}')
            AND 
            (shantytowns.closed_at >= '${date}' OR shantytowns.closed_at IS NULL)
            ${departement ? `AND fk_departement = '${departement}'` : ''}
            `,
        {
            type: sequelize.QueryTypes.SELECT,
        },
    );

    return rows[0].total;
};
