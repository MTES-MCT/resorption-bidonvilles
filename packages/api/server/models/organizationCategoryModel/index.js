module.exports = database => ({
    findAll: () => database.query(
        `SELECT
            uid,
            name_singular,
            name_plural
        FROM organization_categories`,
        {
            type: database.QueryTypes.SELECT,
        },
    ),

    findOneById: async (uid) => {
        const result = await database.query(
            `SELECT
                uid,
                name_singular,
                name_plural
            FROM organization_categories
            WHERE uid = :uid`,
            {
                type: database.QueryTypes.SELECT,
                replacements: {
                    uid,
                },
            },
        );

        return result.length === 1 ? result[0] : null;
    },
});
