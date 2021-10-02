module.exports = database => ({
    findAll: () => database.query(
        `SELECT
            finance_types.uid AS uid,
            finance_types.name AS name
        FROM finance_types`,
        {
            type: database.QueryTypes.SELECT,
        },
    ),
});
