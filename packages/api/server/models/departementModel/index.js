module.exports = database => ({
    findAll: () => database.query(
        `SELECT
            departements.code AS code,
            departements.name AS name
        FROM departements
        ORDER BY code ASC`,
        {
            type: database.QueryTypes.SELECT,
        },
    ),

    findOne: async (code) => {
        const departement = await database.query(
            `SELECT
                departements.code AS code,
                departements.name AS name
            FROM departements
            WHERE code = :code`,
            {
                type: database.QueryTypes.SELECT,
                replacements: {
                    code,
                },
            },
        );

        return departement.length > 0 ? departement[0] : null;
    },
});
