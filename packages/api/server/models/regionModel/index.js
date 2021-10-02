module.exports = database => ({
    findAll: () => database.query(
        `SELECT
            regions.code AS code,
            regions.name AS name
        FROM regions`,
        {
            type: database.QueryTypes.SELECT,
        },
    ),
});
