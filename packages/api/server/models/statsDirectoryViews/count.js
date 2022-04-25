const sequelize = require('#db/sequelize');

module.exports = async () => {
    const rows = await sequelize.query(
        `SELECT
            count(*) as total
        FROM stats_directory_views`,
        {
            type: sequelize.QueryTypes.SELECT,
        },
    );

    return rows[0].total;
};
