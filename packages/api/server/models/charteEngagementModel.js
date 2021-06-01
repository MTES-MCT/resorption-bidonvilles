const { backUrl } = require('#server/config');

module.exports = database => ({
    getLatest: async () => {
        const rows = await database.query(
            `SELECT
                version,
                fichier
            FROM chartes_engagement
            ORDER BY version DESC
            LIMIT 1`,
            {
                type: database.QueryTypes.SELECT,
            },
        );

        return rows.length === 1
            ? {
                version: rows[0].version,
                fichier: `${backUrl}/assets/chartes_engagement/${rows[0].fichier}`,
            }
            : null;
    },
});
