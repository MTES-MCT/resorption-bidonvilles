module.exports = database => ({
    findAll: () => database.query(
        `SELECT
            plan_categories.uid AS uid,
            plan_categories.name AS name
        FROM plan_categories`,
        {
            type: database.QueryTypes.SELECT,
        },
    ),
});
