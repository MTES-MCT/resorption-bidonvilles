const { sequelize } = require('#db/models');

module.exports = async (departement) => {
    const rows = await sequelize.query(
        `
        SELECT COUNT(*) AS total
        FROM shantytowns 
        LEFT JOIN cities AS city ON shantytowns.fk_city = city.code
        WHERE closed_at IS NOT NULL
        AND closed_with_solutions='yes'
        AND shantytowns.created_at > '2019-01-01'
        ${departement ? `AND fk_departement = '${departement}'` : ''}
        `,
        {
            type: sequelize.QueryTypes.SELECT,
        },
    );

    return rows[0].total;
};
