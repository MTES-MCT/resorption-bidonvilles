const sequelize = require('#db/sequelize');
const { backUrl } = require('#server/config');

module.exports = async () => {
    const rows = await sequelize.query(
        `SELECT
            version,
            fichier
        FROM chartes_engagement
        ORDER BY version DESC
        LIMIT 1`,
        {
            type: sequelize.QueryTypes.SELECT,
        },
    );

    return rows.length === 1
        ? {
            version: rows[0].version,
            fichier: `${backUrl}/assets/chartes_engagement/${rows[0].fichier}`,
        }
        : null;
};
