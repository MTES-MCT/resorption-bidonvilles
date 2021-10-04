const { sequelize } = require('#db/models');

module.exports = async (departement) => {
    const rows = await sequelize.query(
        `
        SELECT SUM(population_total) AS total
        FROM shantytowns 
        LEFT JOIN cities AS city ON shantytowns.fk_city = city.code
        WHERE closed_at IS NULL
        ${departement ? `AND fk_departement = '${departement}'` : ''}
        `,
        {
            type: sequelize.QueryTypes.SELECT,
        },
    );

    return rows[0].total;
};
