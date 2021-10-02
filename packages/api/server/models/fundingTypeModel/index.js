module.exports = database => ({
    findAll: () => database.query(
        `SELECT
            funding_types.funding_type_id AS id,
            funding_types.label AS label
        FROM funding_types`,
        {
            type: database.QueryTypes.SELECT,
        },
    ),
});
